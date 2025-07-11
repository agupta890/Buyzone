import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/products";

const categories = ["upperwear", "footwear", "lowerwear", "accessories"];

export const Admin = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "upperwear",
    stock: 0,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Add failed");
      setFormData({ name: "", price: "", image: "", category: "upperwear" });
      fetchProducts();
    } catch {
      setError("Failed to add product");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add Product Form */}
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-6 rounded shadow mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
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
            setFormData({ ...formData, category: e.target.value })
          }
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="col-span-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
        >
          Add Product
        </button>
        <input
          type="number"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="border p-2 rounded"
          required
        />
      </form>

      {/* Product List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded shadow p-4 relative"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-32 w-full object-cover rounded"
              />
              <h3 className="text-lg font-medium mt-2">{product.name}</h3>
              <p className="text-yellow-600 font-bold">₹{product.price}</p>
              <p className="text-sm text-gray-500 capitalize">
                {product.category}
              </p>
              <button
                onClick={() => handleDelete(product._id)}
                className="mt-2 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
              <p className="text-sm text-gray-500">In Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
