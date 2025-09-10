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

      // Reset form
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
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      setError(err.message);
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



            <input
              type="number"
              min="0"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="border p-2 rounded"
              required
            />


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
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            {orders.length === 0 && <p>No orders received yet.</p>}

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow">
                  <h3 className="font-medium mb-2">Order #{order._id}</h3>
                  <p>Customer: {order.customerName}</p>
                  <p>Status: {order.status}</p>
                  <div className="flex gap-2 mt-2">
                    {["Packing", "Dispatched", "Delivered"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateOrder(order._id, status)}
                        className={`px-3 py-1 rounded ${
                          order.status === status
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
