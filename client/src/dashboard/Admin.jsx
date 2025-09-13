import { useEffect, useState } from "react";
import { categories } from "../data/categories";

const API_URL = "http://localhost:3000/api/products";
const API_ORDERS = "http://localhost:3000/api/orders";

export const Admin = () => {
  const [activeTab, setActiveTab] = useState("create"); // create | products | orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    subcategory: "",
    stock: 0,
    isBestsellers: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(API_ORDERS);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setError("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
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
        stock: 0,
        isBestsellers: false,
      });
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
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  // Toggle Bestseller
  const handleToggleBestseller = async (id, currentValue) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBestsellers: !currentValue }),
      });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update Order Status
  const handleUpdateOrder = async (id, status) => {
    try {
      await fetch(`${API_ORDERS}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      setError("Failed to update order status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-2">
          <button
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "create" ? "bg-yellow-500 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("create")}
          >
            ➕ Create Product
          </button>
          <div>
            <p className="px-4 py-2 font-semibold text-gray-700">📦 All Products</p>
            {Object.keys(categories).map((catKey) => (
              <button
                key={catKey}
                onClick={() => {
                  setActiveTab("products");
                  setSelectedCategory(catKey);
                  setSelectedSubcategory(null);
                }}
                className={`block w-full text-left px-6 py-2 rounded mb-1 ${
                  selectedCategory === catKey
                    ? "bg-yellow-500 text-white font-bold"
                    : "hover:bg-gray-100"
                }`}
              >
                {categories[catKey].title}
              </button>
            ))}
          </div>
          <button
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === "orders" ? "bg-yellow-500 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            🧾 Orders
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
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
              className="border p-2 rounded"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border p-2 rounded"
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="border p-2 rounded"
              required
            />

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value, subcategory: "" })
              }
              className="border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {Object.keys(categories).map((catKey) => (
                <option key={catKey} value={catKey}>
                  {categories[catKey].title}
                </option>
              ))}
            </select>

            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              className="border p-2 rounded"
              disabled={
                !formData.category || categories[formData.category]?.subcategories?.length === 0
              }
            >
              <option value="">Select Sub Category</option>
              {formData.category &&
                categories[formData.category]?.subcategories?.map((sub) => (
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
              className="border p-2 rounded"
              required
            />

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
                {categories[selectedCategory]?.subcategories?.map((sub) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                    {product.isBestsellers && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Bestseller
                      </span>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleToggleBestseller(product._id, product.isBestsellers)
                        }
                        className={`text-sm px-3 py-1 rounded ${
                          product.isBestsellers
                            ? "bg-gray-400 hover:bg-gray-500 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {product.isBestsellers ? "Unmark Bestseller" : "Mark Bestseller"}
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

        {/* Orders */}
       {/* Orders */}
{activeTab === "orders" && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Orders</h2>
    {orders.length === 0 ? (
      <p>No orders received yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-3 border">Order ID</th>
              <th className="p-3 border">User</th>
              <th className="p-3 border">Address</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-sm hover:bg-gray-50">
                {/* Order ID */}
                <td className="p-3 border">{order._id}</td>

                {/* User */}
                <td className="p-3 border">
                  {order.user?.name || "—"} <br />
                  <span className="text-xs text-gray-500">{order.user?.email}</span>
                </td>

                {/* Address */}
                <td className="p-3 border">
                  {order.address_id ? (
                    <>
                      <p>{order.address_id.fullName}</p>
                      <p>{order.address_id.street}, {order.address_id.city}</p>
                      <p>{order.address_id.state} - {order.address_id.pincode}</p>
                      <p className="text-xs text-gray-500">{order.address_id.phone}</p>
                    </>
                  ) : (
                    <span className="text-gray-400">No address</span>
                  )}
                </td>

                {/* Payment */}
                <td className="p-3 border">
                  {order.payment_method || "N/A"} <br />
                  <span className="text-xs text-gray-500">{order.payment_id}</span>
                </td>

                {/* Status */}
                <td className="p-3 border font-medium">{order.status}</td>

                {/* Actions */}
                <td className="p-3 border">
                  <div className="flex flex-col gap-1">
                    {["Packing", "Dispatched", "Delivered"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateOrder(order._id, status)}
                        className={`px-2 py-1 text-xs rounded ${
                          order.status === status
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

      </main>
    </div>
  );
};
