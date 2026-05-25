import { useEffect, useState, useContext } from "react";
import { useCategories } from "../context/CategoriesContext";
import { useFlashSale } from "../context/FlashSaleContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Package, ShoppingBag, Users, RotateCcw, AlertTriangle, BarChart2, Tag, Plus, Trash2, Edit2, X, Image, Zap, Clock, ChevronUp, ChevronDown, LogOut } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;


const API_PRODUCTS = `${API_URL}/api/products`;
const API_ORDERS = `${API_URL}/api/admin/orders`;
const API_STATS = `${API_URL}/api/admin/stats`;
const API_SLIDER = `${API_URL}/api/slider`;
const API_FLASH_SALE = `${API_URL}/api/flash-sale`;

// ── KPI Card ──────────────────────────────────────────────
const KpiCard = ({ title, value, sub, icon: Icon, color, change }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
    {change !== undefined && change !== null && (
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
        {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(change)}%
      </div>
    )}
  </div>
);

// ── Mini Bar Chart ─────────────────────────────────────────
const MiniBarChart = ({ data, label }) => {
  const max = Math.max(...data.map(d => d.revenue), 1);
  const last7 = data.slice(-7);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-sm font-black text-gray-700 mb-4">{label}</h3>
      <div className="flex items-end gap-1 h-24">
        {last7.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-amber-400 rounded-t transition-all"
              style={{ height: `${Math.max((d.revenue / max) * 80, 2)}px` }}
              title={`₹${d.revenue.toLocaleString()}`}
            />
            <span className="text-[8px] text-gray-400 font-medium">{d.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Delivered: "bg-emerald-50 text-emerald-700",
    Dispatched: "bg-blue-50 text-blue-700",
    Packing: "bg-orange-50 text-orange-700",
    Cancelled: "bg-red-50 text-red-700",
    Return_Requested: "bg-orange-50 text-orange-700",
    Returned: "bg-purple-50 text-purple-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Paid: "bg-yellow-50 text-yellow-700",
  };
  const label = status === "Return_Requested" ? "Return Req." : status;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] || "bg-gray-50 text-gray-600"}`}>
      {label}
    </span>
  );
};

export const Admin = () => {
  const { categories, catArray, setCatArray, setCategories } = useCategories();
  const { setFlashSale: setGlobalFlashSale } = useFlashSale();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    subcategory: "",
    description: "",
    stock: 0,
    isBestsellers: false,
    returnDays: 7,
  });

  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [uploadKey, setUploadKey] = useState(Date.now());
  const [editProduct, setEditProduct] = useState(null); // product being edited
  const [editSaving, setEditSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ── Category management ──
  const [catSaving, setCatSaving] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [newCatForm, setNewCatForm] = useState({ slug: "", title: "", subtitle: "", image: "", icon: "ShoppingBag", color: "from-amber-500 to-orange-400", subcategories: "" });
  const [newSubInput, setNewSubInput] = useState("");
  const API_CATS = `${API_URL}/api/categories`;

  // ── Banners (slider) state ──
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [bannerSaving, setBannerSaving] = useState(false);
  const [newBannerForm, setNewBannerForm] = useState({ imageUrl: "", title: "", subtitle: "", linkUrl: "/shop-all", order: 0, isActive: true });

  // ── Flash Sale state ──
  const [localFlashSale, setLocalFlashSale] = useState(null);
  const [flashSaving, setFlashSaving] = useState(false);
  const [newRule, setNewRule] = useState({ type: "all", target: "", targetName: "", discount: 10 });
  const [saleDuration, setSaleDuration] = useState(60); // minutes

  const refreshCats = async () => {
    const res = await fetch(API_CATS);
    const data = await res.json();
    if (Array.isArray(data)) {
      setCatArray(data);
      setCategories(data.reduce((acc, c) => { acc[c.slug] = c; return acc; }, {}));
    }
  };

  const handleCreateCat = async (e) => {
    e.preventDefault();
    setCatSaving(true);
    try {
      const payload = { ...newCatForm, subcategories: newCatForm.subcategories.split(",").map(s => s.trim()).filter(Boolean) };
      const res = await fetch(API_CATS, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create");
      await refreshCats();
      setNewCatForm({ slug: "", title: "", subtitle: "", image: "", icon: "ShoppingBag", color: "from-amber-500 to-orange-400", subcategories: "" });
    } catch (err) { alert(err.message); }
    finally { setCatSaving(false); }
  };

  const handleSaveCat = async (e) => {
    e.preventDefault();
    setCatSaving(true);
    try {
      const res = await fetch(`${API_CATS}/${editCat.slug}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editCat) });
      if (!res.ok) throw new Error("Failed to save");
      await refreshCats();
      setEditCat(null);
    } catch (err) { alert(err.message); }
    finally { setCatSaving(false); }
  };

  const handleDeleteCat = async (slug) => {
    if (!window.confirm(`Delete category "${slug}"? Products in this category will not be deleted.`)) return;
    try {
      await fetch(`${API_CATS}/${slug}`, { method: "DELETE", credentials: "include" });
      await refreshCats();
    } catch { alert("Delete failed"); }
  };

  const handleAddSubcategory = async (cat, sub) => {
    if (!sub.trim()) return;
    const updated = [...(cat.subcategories || []), sub.trim()];
    await fetch(`${API_CATS}/${cat.slug}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subcategories: updated }) });
    await refreshCats();
  };

  const handleRemoveSubcategory = async (cat, sub) => {
    const updated = cat.subcategories.filter(s => s !== sub);
    await fetch(`${API_CATS}/${cat.slug}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subcategories: updated }) });
    await refreshCats();
  };

  // ── Banner helpers ──────────────────────────────────────────
  const fetchBanners = async () => {
    setBannersLoading(true);
    try {
      const res = await fetch(`${API_SLIDER}/all`, { credentials: "include" });
      const data = await res.json();
      if (Array.isArray(data)) setBanners(data);
    } catch { /* silently fail */ }
    finally { setBannersLoading(false); }
  };

  const handleBannerImageFile = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setter(prev => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    setBannerSaving(true);
    try {
      const res = await fetch(API_SLIDER, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newBannerForm) });
      if (!res.ok) throw new Error("Failed to create");
      await fetchBanners();
      setNewBannerForm({ imageUrl: "", title: "", subtitle: "", linkUrl: "/shop-all", order: banners.length, isActive: true });
    } catch (err) { alert(err.message); }
    finally { setBannerSaving(false); }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setBannerSaving(true);
    try {
      const res = await fetch(`${API_SLIDER}/${editBanner._id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editBanner) });
      if (!res.ok) throw new Error("Failed to save");
      await fetchBanners();
      setEditBanner(null);
    } catch (err) { alert(err.message); }
    finally { setBannerSaving(false); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    await fetch(`${API_SLIDER}/${id}`, { method: "DELETE", credentials: "include" });
    await fetchBanners();
  };

  const handleToggleBannerActive = async (banner) => {
    await fetch(`${API_SLIDER}/${banner._id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !banner.isActive }) });
    await fetchBanners();
  };

  const handleMoveBanner = async (banner, dir) => {
    const newOrder = banner.order + dir;
    await fetch(`${API_SLIDER}/${banner._id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: newOrder }) });
    await fetchBanners();
  };

  // Formats a UTC ISO date string as a value for datetime-local input (local time)
  const toLocalInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // ── Flash Sale helpers ───────────────────────────────────────
  const fetchFlashSale = async () => {
    try {
      const res = await fetch(API_FLASH_SALE, { credentials: "include" });
      const data = await res.json();
      setLocalFlashSale(data);
    } catch { /* silently fail */ }
  };

  const saveFlashSale = async (updates) => {
    setFlashSaving(true);
    try {
      const merged = { ...localFlashSale, ...updates };
      const res = await fetch(API_FLASH_SALE, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(merged) });
      const data = await res.json();
      setLocalFlashSale(data);
      setGlobalFlashSale(data); // sync global context so ProductCard updates live
    } catch (err) { alert("Failed to save flash sale"); }
    finally { setFlashSaving(false); }
  };

  const handleAddRule = () => {
    if (!newRule.discount || newRule.discount < 1) return;
    if ((newRule.type !== "all") && !newRule.target.trim()) { alert("Please enter a target (category slug or product ID)"); return; }
    const updated = [...(localFlashSale?.rules || []), { ...newRule }];
    saveFlashSale({ rules: updated });
    setNewRule({ type: "all", target: "", targetName: "", discount: 10 });
  };

  const handleRemoveRule = (idx) => {
    const updated = localFlashSale.rules.filter((_, i) => i !== idx);
    saveFlashSale({ rules: updated });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_PRODUCTS}?limit=1000`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch(API_ORDERS, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
      else setOrdersError(data.message || "Failed to fetch orders");
    } catch (err) {
      setOrdersError("Failed to fetch orders. Is the server running?");
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(API_STATS, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchStats();
    fetchBanners();
    fetchFlashSale();
  }, []);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_PRODUCTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add product");

      setFormData({
        name: "",
        price: "",
        image: "",
        category: "",
        subcategory: "",
        description: "",
        stock: 0,
        isBestsellers: false,
        returnDays: 7,
      });
      setUploadKey(Date.now());
      fetchProducts();
      setActiveTab("products");
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  // Toggle Bestseller
  const handleToggleBestseller = async (id, currentValue) => {
    try {
      await fetch(`${API_PRODUCTS}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBestsellers: !currentValue }),
      });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Save edited product
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const res = await fetch(`${API_PRODUCTS}/${editProduct._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });
      if (!res.ok) throw new Error("Failed to update product");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  // Update Order Status
  const handleUpdateOrder = async (id, status) => {
    try {
      const res = await fetch(`${API_ORDERS}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) fetchOrders();
      else setError(data.message || "Failed to update order status");
    } catch (err) {
      setError("Failed to update order status");
      console.error(err);
    }
  };

  // Sort orders by date (latest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Filter orders by date
  const filteredOrders = sortedOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    switch (dateFilter) {
      case "Today":
        return orderDate.toDateString() === today.toDateString();
      case "Yesterday":
        return orderDate.toDateString() === yesterday.toDateString();
      case "Last 7 Days":
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        return orderDate >= lastWeek && orderDate <= today;
      default:
        return true;
    }
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button onClick={() => setEditProduct(null)} className="text-gray-400 hover:text-black text-2xl font-bold leading-none">&times;</button>
            </div>
            <form onSubmit={handleSaveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text" placeholder="Product Name" required
                value={editProduct.name}
                onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="number" placeholder="Price" required
                value={editProduct.price}
                onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="number" min="0" placeholder="Stock" required
                value={editProduct.stock}
                onChange={e => setEditProduct({ ...editProduct, stock: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Return Policy</label>
                <select
                  value={editProduct.returnDays ?? 7}
                  onChange={e => setEditProduct({ ...editProduct, returnDays: Number(e.target.value) })}
                  className="border p-2 rounded w-full"
                >
                  <option value={0}>No Returns</option>
                  <option value={7}>7 Days Return</option>
                  <option value={10}>10 Days Return</option>
                  <option value={15}>15 Days Return</option>
                  <option value={30}>30 Days Return</option>
                </select>
              </div>
              <select
                value={editProduct.category}
                onChange={e => setEditProduct({ ...editProduct, category: e.target.value, subcategory: "" })}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Category</option>
                {catArray.map(c => (
                  <option key={c.slug} value={c.slug}>{c.title}</option>
                ))}
              </select>
              <select
                value={editProduct.subcategory || ""}
                onChange={e => setEditProduct({ ...editProduct, subcategory: e.target.value })}
                className="border p-2 rounded w-full"
                disabled={!editProduct.category}
              >
                <option value="">Select Subcategory</option>
                {editProduct.category && categories[editProduct.category]?.subcategories?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <textarea
                placeholder="Product Description"
                value={editProduct.description || ""}
                onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                className="border p-2 rounded w-full col-span-full h-24"
              />
              <div className="flex items-center gap-2 col-span-full">
                <input
                  type="checkbox"
                  checked={editProduct.isBestsellers || false}
                  onChange={e => setEditProduct({ ...editProduct, isBestsellers: e.target.checked })}
                  id="edit-bestseller"
                />
                <label htmlFor="edit-bestseller" className="text-sm font-semibold">Mark as Bestseller</label>
              </div>
              {error && <p className="text-red-500 text-sm col-span-full">{error}</p>}
              <div className="col-span-full flex gap-3 mt-2">
                <button type="button" onClick={() => setEditProduct(null)} className="flex-1 border border-gray-300 py-2 rounded font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={editSaving} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-semibold disabled:opacity-60">
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-60 bg-slate-900 text-slate-300 p-5 space-y-1 md:min-h-screen flex-shrink-0">
        <div className="pb-5 mb-3 border-b border-slate-800">
          <h2 className="text-lg font-black text-white tracking-tight">Buy<span className="text-amber-500">Zone</span></h2>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Admin Panel</p>
        </div>
        <nav className="space-y-0.5">
          {[
            { id: "dashboard", icon: <BarChart2 size={15} />, label: "Dashboard" },
            { id: "create",    icon: <Plus size={15} />,     label: "Create Product" },
            { id: "products",  icon: <Package size={15} />,  label: "All Products", onClick: () => { setActiveTab("products"); setSelectedCategory(null); setSelectedSubcategory(null); } },
            { id: "orders",    icon: <ShoppingBag size={15} />, label: "Orders" },
            { id: "categories",icon: <Tag size={15} />,      label: "Categories" },
            { id: "banners",   icon: <Image size={15} />,    label: "Banners / Slider" },
            { id: "flashsale", icon: <Zap size={15} />,      label: "Flash Sale" },
          ].map(item => (
            <button
              key={item.id}
              onClick={item.onClick || (() => setActiveTab(item.id))}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id && (!item.id === "products" || !selectedCategory)
                  ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          {/* Category sub-items */}
          {activeTab === "products" && (
            <div className="pl-3 mt-1 space-y-0.5">
              {catArray.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setActiveTab("products"); setSelectedCategory(cat.slug); setSelectedSubcategory(null); }}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.slug
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="pt-5 mt-auto border-t border-slate-800">
          <button
            onClick={async () => {
              if (window.confirm("Are you sure you want to logout?")) {
                await logout();
                navigate("/");
              }
            }}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto bg-slate-50 min-h-screen">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Analytics Overview</h2>
              <button onClick={fetchStats} className="text-xs font-bold text-amber-600 hover:underline">
                Refresh
              </button>
            </div>

            {statsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
              </div>
            ) : stats ? (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <KpiCard
                    title="Total Revenue"
                    value={`₹${stats.kpi.totalRevenue.toLocaleString()}`}
                    sub={`This month: ₹${stats.kpi.thisMonthRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-amber-500"
                    change={stats.kpi.revenueChange}
                  />
                  <KpiCard
                    title="Total Orders"
                    value={stats.kpi.totalOrders}
                    sub={`Pending: ${stats.kpi.statusCounts['Pending'] || 0} · Delivered: ${stats.kpi.statusCounts['Delivered'] || 0}`}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                  />
                  <KpiCard
                    title="Active Customers"
                    value={stats.kpi.activeCustomers}
                    sub="Ordered this month"
                    icon={Users}
                    color="bg-emerald-500"
                  />
                  <KpiCard
                    title="Return Requests"
                    value={stats.kpi.returnRequestCount}
                    sub="Awaiting review"
                    icon={RotateCcw}
                    color={stats.kpi.returnRequestCount > 0 ? "bg-orange-500" : "bg-gray-400"}
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <MiniBarChart data={stats.revenueChart} label="Revenue — Last 7 Days" />

                  {/* Top Products */}
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-black text-gray-700 mb-4">Top 5 Products by Units Sold</h3>
                    <div className="space-y-3">
                      {stats.topProducts.length === 0 && <p className="text-xs text-gray-400">No data yet</p>}
                      {stats.topProducts.map((p, i) => {
                        const max = stats.topProducts[0]?.units || 1;
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs font-black text-gray-400 w-4">{i + 1}</span>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-gray-700 truncate max-w-[200px]">{p.name}</span>
                                <span className="text-gray-500 font-medium">{p.units} units</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full transition-all"
                                  style={{ width: `${(p.units / max) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent Orders */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                      <h3 className="text-sm font-black text-gray-700">Recent Orders</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {stats.recentOrders.map(o => (
                        <div key={o._id} className="flex items-center gap-3 px-5 py-3">
                          <div className="w-8 h-8 bg-gray-50 rounded border border-gray-100 flex-shrink-0 overflow-hidden">
                            {o.firstItem?.image && (
                              <img src={o.firstItem.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">{o.user?.name || "—"}</p>
                            <p className="text-[10px] text-gray-400">#{o._id.slice(-6).toUpperCase()} · {o.itemCount} item{o.itemCount !== 1 ? "s" : ""}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-gray-900">₹{o.total?.toLocaleString()}</p>
                            <StatusBadge status={o.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Low Stock + Return Requests */}
                  <div className="space-y-4">
                    {/* Low Stock */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-orange-500" />
                        <h3 className="text-sm font-black text-gray-700">Low Stock Alerts</h3>
                        <span className="ml-auto text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                          {stats.lowStockProducts.length} items
                        </span>
                      </div>
                      <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                        {stats.lowStockProducts.length === 0 ? (
                          <p className="text-xs text-gray-400 px-5 py-4">All products are well-stocked</p>
                        ) : stats.lowStockProducts.map(p => (
                          <div key={p._id} className="flex items-center gap-3 px-5 py-3">
                            <div className="w-8 h-8 bg-gray-50 rounded flex-shrink-0 overflow-hidden border border-gray-100">
                              <img src={p.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <p className="flex-1 text-xs font-bold text-gray-700 truncate">{p.name}</p>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}>
                              {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Return Requests */}
                    {stats.returnRequests.length > 0 && (
                      <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-orange-50 flex items-center gap-2">
                          <RotateCcw size={14} className="text-orange-500" />
                          <h3 className="text-sm font-black text-gray-700">Open Return Requests</h3>
                          <span className="ml-auto text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                            {stats.returnRequests.length}
                          </span>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-40 overflow-y-auto">
                          {stats.returnRequests.map(r => (
                            <div key={r._id} className="flex items-center gap-3 px-5 py-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-800">{r.user?.name || "—"}</p>
                                {r.return_reason && <p className="text-[10px] text-gray-400 truncate">"{r.return_reason}"</p>}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-bold text-gray-900">₹{r.total?.toLocaleString()}</p>
                                <button
                                  onClick={() => { setActiveTab("orders"); setDateFilter("All"); }}
                                  className="text-[10px] text-orange-600 font-bold hover:underline"
                                >
                                  Review →
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Failed to load stats.</p>
            )}
          </div>
        )}

        {/* Create Product */}
        {activeTab === "create" && (
          <form
            onSubmit={handleAddProduct}
            className="bg-white p-6 rounded shadow grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <h2 className="text-xl font-semibold col-span-full mb-2">Add New Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Product Image</label>
              <div className="flex items-center gap-4">
                <input
                  key={uploadKey}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full text-sm"
                  required={!formData.image}
                />
                {formData.image && (
                  <div className="relative group">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-12 w-12 object-cover rounded border-2 border-yellow-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value, subcategory: "" })
              }
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Category</option>
              {catArray.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.title}
                </option>
              ))}
            </select>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              className="border p-2 rounded w-full"
              disabled={!formData.category || !(categories[formData.category]?.subcategories?.length > 0)}
            >
              <option value="">Select Sub Category</option>
              {formData.category &&
                (categories[formData.category]?.subcategories || []).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
            <input
              type="number"
              min="0"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="border p-2 rounded w-full"
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Return Policy</label>
              <select
                value={formData.returnDays}
                onChange={(e) => setFormData({ ...formData, returnDays: Number(e.target.value) })}
                className="border p-2 rounded w-full"
              >
                <option value={0}>No Returns</option>
                <option value={7}>7 Days Return</option>
                <option value={10}>10 Days Return</option>
                <option value={15}>15 Days Return</option>
                <option value={30}>30 Days Return</option>
              </select>
            </div>
            <textarea
              placeholder="Product Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 rounded w-full col-span-full h-24"
              required
            ></textarea>
            <label className="flex items-center gap-2 col-span-full">
              <input
                type="checkbox"
                checked={formData.isBestsellers}
                onChange={(e) =>
                  setFormData({ ...formData, isBestsellers: e.target.checked })
                }
              />
              Mark as Bestseller
            </label>
            <button
              type="submit"
              className="col-span-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              Add Product
            </button>
          </form>
        )}

        {/* All Products */}
        {activeTab === "products" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Products</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Subcategory navbar */}
            {selectedCategory && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="font-semibold mr-2">Subcategories:</span>
                {(categories[selectedCategory]?.subcategories || []).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-3 py-1 rounded ${
                      selectedSubcategory === sub
                        ? "bg-yellow-500 text-white font-semibold"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`px-3 py-1 rounded ${
                    selectedSubcategory === null
                      ? "bg-yellow-500 text-white font-semibold"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  All
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products
                .filter(
                  (p) =>
                    (!selectedCategory || p.category === selectedCategory) &&
                    (!selectedSubcategory || p.subcategory === selectedSubcategory)
                )
                .map((product) => (
                  <div key={product._id} className="bg-white rounded shadow p-4 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-32 w-full object-cover rounded"
                    />
                    <h3 className="text-lg font-medium mt-2">{product.name}</h3>
                    <p className="text-yellow-600 font-bold">₹{product.price}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description || "No description"}</p>
                    {product.isBestsellers && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Bestseller
                      </span>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        onClick={() => setEditProduct({ ...product })}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleBestseller(product._id, product.isBestsellers)}
                        className={`text-sm px-3 py-1 rounded ${
                          product.isBestsellers
                            ? "bg-gray-400 hover:bg-gray-500 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {product.isBestsellers ? "Unmark" : "Mark"}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Categories ───────────────────────────────────────── */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">Manage Categories</h2>

            {/* Edit modal */}
            {editCat && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black">Edit "{editCat.title}"</h3>
                    <button onClick={() => setEditCat(null)} className="text-gray-400 hover:text-black"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSaveCat} className="space-y-3">
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Title *" required value={editCat.title} onChange={e => setEditCat({ ...editCat, title: e.target.value })} />
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Subtitle" value={editCat.subtitle || ""} onChange={e => setEditCat({ ...editCat, subtitle: e.target.value })} />
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Image URL" value={editCat.image || ""} onChange={e => setEditCat({ ...editCat, image: e.target.value })} />
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Icon (lucide name e.g. Home, Sparkles)" value={editCat.icon || ""} onChange={e => setEditCat({ ...editCat, icon: e.target.value })} />
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Tailwind gradient e.g. from-amber-500 to-orange-400" value={editCat.color || ""} onChange={e => setEditCat({ ...editCat, color: e.target.value })} />

                    {/* Subcategories */}
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">Subcategories</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(editCat.subcategories || []).map(s => (
                          <span key={s} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                            {s}
                            <button type="button" onClick={() => setEditCat({ ...editCat, subcategories: editCat.subcategories.filter(x => x !== s) })} className="text-gray-400 hover:text-red-500"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input id="editSubInput" className="flex-1 border border-gray-200 rounded-xl p-2 text-sm" placeholder="Add subcategory" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const v = e.target.value.trim(); if (v) { setEditCat({ ...editCat, subcategories: [...(editCat.subcategories || []), v] }); e.target.value = ""; }}}} />
                        <button type="button" onClick={() => { const inp = document.getElementById("editSubInput"); const v = inp.value.trim(); if (v) { setEditCat({ ...editCat, subcategories: [...(editCat.subcategories || []), v] }); inp.value = ""; }}} className="bg-gray-100 hover:bg-gray-200 px-3 rounded-xl text-sm font-bold">Add</button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setEditCat(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold hover:bg-gray-50">Cancel</button>
                      <button type="submit" disabled={catSaving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-sm font-bold disabled:opacity-60">
                        {catSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Create new category */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-gray-700 mb-4 flex items-center gap-2"><Plus size={15} /> Add New Category</h3>
              <form onSubmit={handleCreateCat} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Slug (e.g. kitchen-items) *" value={newCatForm.slug} onChange={e => setNewCatForm({ ...newCatForm, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
                <input required className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Title (e.g. Kitchen Items) *" value={newCatForm.title} onChange={e => setNewCatForm({ ...newCatForm, title: e.target.value })} />
                <input className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Subtitle" value={newCatForm.subtitle} onChange={e => setNewCatForm({ ...newCatForm, subtitle: e.target.value })} />
                <input className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Image URL" value={newCatForm.image} onChange={e => setNewCatForm({ ...newCatForm, image: e.target.value })} />
                <input className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Icon (Home, Sparkles, Book…)" value={newCatForm.icon} onChange={e => setNewCatForm({ ...newCatForm, icon: e.target.value })} />
                <input className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Gradient (from-X-500 to-Y-400)" value={newCatForm.color} onChange={e => setNewCatForm({ ...newCatForm, color: e.target.value })} />
                <input className="sm:col-span-2 border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Subcategories (comma-separated e.g. Pots, Pans, Cutlery)" value={newCatForm.subcategories} onChange={e => setNewCatForm({ ...newCatForm, subcategories: e.target.value })} />
                <button type="submit" disabled={catSaving} className="sm:col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60">
                  {catSaving ? "Creating..." : "Create Category"}
                </button>
              </form>
            </div>

            {/* Existing categories */}
            <div className="space-y-3">
              {catArray.map(cat => (
                <div key={cat.slug} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
                  {cat.image && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                      <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-gray-900">{cat.title}</h4>
                      <code className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{cat.slug}</code>
                    </div>
                    {cat.subtitle && <p className="text-xs text-gray-400 mt-0.5">{cat.subtitle}</p>}

                    {/* Subcategories inline */}
                    <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                      {(cat.subcategories || []).map(s => (
                        <span key={s} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                          {s}
                          <button onClick={() => handleRemoveSubcategory(cat, s)} className="text-amber-400 hover:text-red-500 transition-colors"><X size={9} /></button>
                        </span>
                      ))}
                      {/* Quick add subcategory */}
                      <form onSubmit={e => { e.preventDefault(); const val = e.target.sub.value.trim(); if (val) { handleAddSubcategory(cat, val); e.target.reset(); }}} className="inline-flex items-center gap-1">
                        <input name="sub" className="text-[10px] border border-dashed border-gray-300 rounded-full px-2 py-0.5 w-24 focus:outline-none focus:border-amber-400" placeholder="+ add sub" />
                        <button type="submit" className="text-[10px] font-bold text-amber-600 hover:text-amber-700">Add</button>
                      </form>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setEditCat({ ...cat })} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                    <button onClick={() => handleDeleteCat(cat.slug)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Orders</h2>

            {/* Date Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["All", "Today", "Yesterday", "Last 7 Days"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter)}
                  className={`px-3 py-1 rounded ${
                    dateFilter === filter
                      ? "bg-yellow-500 text-white font-semibold"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {ordersLoading && <p className="text-gray-500">Loading orders...</p>}
            {ordersError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm font-semibold">
                ⚠️ {ordersError}
              </div>
            )}
            {!ordersLoading && !ordersError && filteredOrders.length === 0 ? (
              <p>No orders for selected date.</p>
            ) : !ordersLoading && !ordersError && (
              <div className="flex flex-col gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className={`bg-white shadow-md rounded-lg p-4 border ${
                      order.status === "Return_Requested"
                        ? "border-orange-300 ring-1 ring-orange-200"
                        : "border-gray-200"
                    }`}
                  >
                    {order.status === "Return_Requested" && (
                      <div className="mb-3 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                        <span>⚠️</span>
                        <span>Return Requested{order.return_reason ? ` — "${order.return_reason}"` : ""}</span>
                      </div>
                    )}
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-semibold">
                          {order.user?.name || "—"} ({order.user?.email})
                        </p>
                        <p className="text-gray-500 text-sm">
                          Order ID: {order._id} | {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrder(order._id, e.target.value)}
                          className={`border rounded p-1 font-semibold text-sm ${
                            order.status === "Return_Requested" ? "border-orange-400 text-orange-600 bg-orange-50" :
                            order.status === "Returned" ? "border-purple-400 text-purple-600 bg-purple-50" :
                            order.status === "Cancelled" ? "border-red-300 text-red-600 bg-red-50" :
                            order.status === "Delivered" ? "border-green-300 text-green-600 bg-green-50" : ""
                          }`}
                        >
                          {["Pending", "Paid", "Packing", "Dispatched", "Delivered", "Cancelled", "Return_Requested", "Returned"].map((status) => (
                            <option key={status} value={status}>
                              {status === "Return_Requested" ? "Return Requested" : status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-2 text-sm text-gray-700">
                      <p className="font-semibold">Shipping Address:</p>
                      {order.address_id ? (
                        <>
                          <p>{order.address_id.house_no}, {order.address_id.building}</p>
                          <p>{order.address_id.street}, {order.address_id.city}</p>
                          <p>
                            {order.address_id.state} - {order.address_id.pincode}
                          </p>
                          <p className="text-xs text-gray-500">{order.address_id.phone}</p>
                        </>
                      ) : (
                        <span className="text-gray-400">No address</span>
                      )}
                    </div>

                    {/* Payment */}
                    <div className="mb-2 text-sm text-gray-700">
                      <p className={`font-semibold ${
                        order.payment_method === "COD" ? "text-yellow-600" : "text-green-600"
                      }`}>
                        Payment: {order.payment_method === "COD" ? "COD" : "Paid"}{" "}
                        {order.payment_method !== "COD" && order.payment_id
                          ? `(Transaction ID: ${order.payment_id})`
                          : ""}
                      </p>
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.product?._id}
                          className="border p-2 rounded flex items-center gap-2 hover:shadow-md transition-shadow"
                        >
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold">{item.product?.name}</p>
                            <p className="text-sm">Qty: {item.quantity}</p>
                            <p className="text-yellow-600 font-bold">₹{item.product?.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* ── Banners / Slider ─────────────────────────────────── */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Banners / Slider</h2>
              <button onClick={fetchBanners} className="text-xs font-bold text-amber-600 hover:underline">Refresh</button>
            </div>

            {/* Edit Banner Modal */}
            {editBanner && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black">Edit Slide</h3>
                    <button onClick={() => setEditBanner(null)}><X size={20} className="text-gray-400" /></button>
                  </div>
                  <form onSubmit={handleSaveBanner} className="space-y-3">
                    {/* Image preview + upload */}
                    {editBanner.imageUrl && (
                      <img src={editBanner.imageUrl} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                    )}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Image URL</label>
                      <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="https://..." value={editBanner.imageUrl} onChange={e => setEditBanner({ ...editBanner, imageUrl: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Or upload image</label>
                      <input type="file" accept="image/*" onChange={e => handleBannerImageFile(e, setEditBanner)} className="text-sm w-full" />
                    </div>
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Title (e.g. Elevate Your Everyday)" value={editBanner.title || ""} onChange={e => setEditBanner({ ...editBanner, title: e.target.value })} />
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Subtitle / Badge text" value={editBanner.subtitle || ""} onChange={e => setEditBanner({ ...editBanner, subtitle: e.target.value })} />
                    <input className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Link URL (e.g. /shop-all)" value={editBanner.linkUrl || ""} onChange={e => setEditBanner({ ...editBanner, linkUrl: e.target.value })} />
                    <div className="flex items-center gap-3">
                      <input type="number" min="0" className="w-24 border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Order" value={editBanner.order ?? 0} onChange={e => setEditBanner({ ...editBanner, order: Number(e.target.value) })} />
                      <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                        <input type="checkbox" checked={editBanner.isActive} onChange={e => setEditBanner({ ...editBanner, isActive: e.target.checked })} />
                        Active
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setEditBanner(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold hover:bg-gray-50">Cancel</button>
                      <button type="submit" disabled={bannerSaving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-sm font-bold disabled:opacity-60">
                        {bannerSaving ? "Saving..." : "Save Slide"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add New Slide */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-gray-700 mb-4 flex items-center gap-2"><Plus size={15} /> Add New Slide</h3>
              <form onSubmit={handleCreateBanner} className="space-y-3">
                {newBannerForm.imageUrl && (
                  <img src={newBannerForm.imageUrl} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500">Image URL</label>
                    <input required={!newBannerForm.imageUrl} className="w-full border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="https://..." value={newBannerForm.imageUrl} onChange={e => setNewBannerForm({ ...newBannerForm, imageUrl: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500">Or upload image (max 5MB)</label>
                    <input type="file" accept="image/*" onChange={e => handleBannerImageFile(e, setNewBannerForm)} className="text-sm w-full" />
                  </div>
                  <input className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Title" value={newBannerForm.title} onChange={e => setNewBannerForm({ ...newBannerForm, title: e.target.value })} />
                  <input className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Subtitle / Badge" value={newBannerForm.subtitle} onChange={e => setNewBannerForm({ ...newBannerForm, subtitle: e.target.value })} />
                  <input className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Link URL (e.g. /shop-all)" value={newBannerForm.linkUrl} onChange={e => setNewBannerForm({ ...newBannerForm, linkUrl: e.target.value })} />
                  <input type="number" min="0" className="border border-gray-200 rounded-xl p-2.5 text-sm" placeholder="Order" value={newBannerForm.order} onChange={e => setNewBannerForm({ ...newBannerForm, order: Number(e.target.value) })} />
                </div>
                <button type="submit" disabled={bannerSaving || !newBannerForm.imageUrl} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60">
                  {bannerSaving ? "Adding..." : "Add Slide"}
                </button>
              </form>
            </div>

            {/* Existing Slides */}
            {bannersLoading ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div></div>
            ) : (
              <div className="space-y-3">
                {banners.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No slides yet. Add one above.</p>}
                {banners.map((banner) => (
                  <div key={banner._id} className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 ${banner.isActive ? "border-gray-100" : "border-dashed border-gray-200 opacity-60"}`}>
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {banner.imageUrl && <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{banner.title || <span className="text-gray-400 italic">No title</span>}</p>
                      {banner.subtitle && <p className="text-xs text-gray-400">{banner.subtitle}</p>}
                      <p className="text-[10px] text-amber-600 font-bold mt-0.5">{banner.linkUrl}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Move order */}
                      <button onClick={() => handleMoveBanner(banner, -1)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronUp size={14} /></button>
                      <button onClick={() => handleMoveBanner(banner, 1)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><ChevronDown size={14} /></button>
                      {/* Toggle active */}
                      <button
                        onClick={() => handleToggleBannerActive(banner)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-colors ${banner.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100" : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600"}`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </button>
                      <button onClick={() => setEditBanner({ ...banner })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteBanner(banner._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Flash Sale ───────────────────────────────────────── */}
        {activeTab === "flashsale" && localFlashSale && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><Zap size={20} className="text-amber-500" /> Flash Sale</h2>
              {flashSaving && <span className="text-xs text-amber-600 font-bold animate-pulse">Saving...</span>}
            </div>

            {/* Main toggle card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              {/* Sale label */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Sale Label (shown in banner)</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-gray-200 rounded-xl p-2.5 text-sm"
                    value={localFlashSale.label || ""}
                    onChange={e => setLocalFlashSale({ ...localFlashSale, label: e.target.value })}
                    placeholder="e.g. Summer Sale"
                  />
                  <button onClick={() => saveFlashSale({ label: localFlashSale.label })} className="px-4 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600">Save</button>
                </div>
              </div>

              {/* Duration picker */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1"><Clock size={11} /> Sale Duration (starts immediately when toggled on)</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[
                    { label: "30m", value: 30 },
                    { label: "1 hr", value: 60 },
                    { label: "2 hr", value: 120 },
                    { label: "4 hr", value: 240 },
                    { label: "6 hr", value: 360 },
                    { label: "12 hr", value: 720 },
                    { label: "24 hr", value: 1440 },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSaleDuration(opt.value)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${saleDuration === opt.value ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-200 hover:border-amber-400"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Custom (minutes):</span>
                  <input
                    type="number" min="1"
                    className="w-24 border border-gray-200 rounded-xl p-2 text-sm text-center"
                    value={saleDuration}
                    onChange={e => setSaleDuration(Number(e.target.value))}
                  />
                </div>
                {localFlashSale.endsAt && (
                  <p className="text-xs text-amber-600 font-semibold mt-1">
                    ⏳ Currently ends: {new Date(localFlashSale.endsAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <p className="font-black text-gray-900">Flash Sale Status</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {localFlashSale.isActive ? "Sale is LIVE — toggle off to stop it." : `Toggle on to start a ${saleDuration >= 60 ? `${saleDuration/60} hr` : `${saleDuration} min`} sale immediately.`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!localFlashSale.isActive) {
                      const endsAt = new Date(Date.now() + saleDuration * 60 * 1000).toISOString();
                      saveFlashSale({ isActive: true, endsAt });
                    } else {
                      saveFlashSale({ isActive: false, endsAt: null });
                    }
                  }}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${localFlashSale.isActive ? "bg-amber-500" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${localFlashSale.isActive ? "translate-x-7" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            {/* Discount Rules */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-black text-gray-900 text-sm">Discount Rules</h3>
              <p className="text-xs text-gray-400">Rules are applied in priority order: <strong>Product</strong> &gt; <strong>Category</strong> &gt; <strong>All Products</strong>. The most specific rule wins.</p>

              {/* Add rule form */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-black text-gray-600 uppercase tracking-wider">Add New Rule</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Apply To</label>
                    <select
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-white"
                      value={newRule.type}
                      onChange={e => setNewRule({ ...newRule, type: e.target.value, target: "", targetName: "" })}
                    >
                      <option value="all">All Products</option>
                      <option value="category">Specific Category</option>
                      <option value="product">Specific Product</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Discount %</label>
                    <input
                      type="number" min="1" max="99"
                      className="w-full border border-gray-200 rounded-xl p-2.5 text-sm"
                      placeholder="e.g. 20"
                      value={newRule.discount}
                      onChange={e => setNewRule({ ...newRule, discount: Number(e.target.value) })}
                    />
                  </div>

                  {newRule.type === "category" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Category</label>
                        <select
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-sm bg-white"
                          value={newRule.target}
                          onChange={e => {
                            const cat = catArray.find(c => c.slug === e.target.value);
                            setNewRule({ ...newRule, target: e.target.value, targetName: cat?.title || e.target.value });
                          }}
                        >
                          <option value="">Select category</option>
                          {catArray.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {newRule.type === "product" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product ID</label>
                        <input
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-sm"
                          placeholder="MongoDB _id"
                          value={newRule.target}
                          onChange={e => setNewRule({ ...newRule, target: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Label (optional)</label>
                        <input
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-sm"
                          placeholder="Product name for display"
                          value={newRule.targetName}
                          onChange={e => setNewRule({ ...newRule, targetName: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>
                <button onClick={handleAddRule} className="w-full sm:w-auto px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2">
                  <Plus size={15} /> Add Rule
                </button>
              </div>

              {/* Existing rules */}
              <div className="space-y-2">
                {(!localFlashSale.rules || localFlashSale.rules.length === 0) && (
                  <p className="text-xs text-gray-400 text-center py-4">No rules yet. Add one above to start discounting.</p>
                )}
                {(localFlashSale.rules || []).map((rule, idx) => (
                  <div key={rule._id || idx} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${rule.type === "all" ? "bg-amber-100 text-amber-700" : rule.type === "category" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                      {rule.type}
                    </div>
                    <div className="flex-1 min-w-0">
                      {rule.type === "all" && <span className="text-sm font-bold text-gray-800">All Products</span>}
                      {rule.type === "category" && <span className="text-sm font-bold text-gray-800">{rule.targetName || rule.target}</span>}
                      {rule.type === "product" && (
                        <span className="text-sm font-bold text-gray-800 truncate block">{rule.targetName || rule.target}</span>
                      )}
                    </div>
                    <span className="text-lg font-black text-amber-600">{rule.discount}% OFF</span>
                    <button onClick={() => handleRemoveRule(idx)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className={`rounded-xl p-4 border-2 ${localFlashSale.isActive ? "border-amber-300 bg-amber-50" : "border-dashed border-gray-200 bg-gray-50"}`}>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Preview</p>
              {localFlashSale.isActive ? (
                <p className="text-sm font-bold text-amber-700">
                  ⚡ <strong>{localFlashSale.label}</strong> is <strong>LIVE</strong>
                  {localFlashSale.endsAt && ` · ends ${new Date(localFlashSale.endsAt).toLocaleString()}`}
                  {localFlashSale.rules?.length > 0 && ` · ${localFlashSale.rules.length} rule${localFlashSale.rules.length !== 1 ? "s" : ""} active`}
                </p>
              ) : (
                <p className="text-sm text-gray-400">Flash sale is currently <strong>OFF</strong>. Toggle the switch above to activate.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "flashsale" && !localFlashSale && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
          </div>
        )}
      </main>
    </div>
  );
};
