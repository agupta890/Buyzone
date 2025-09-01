import { useEffect, useState } from "react";
import { categories } from "../data/categories";

const API_URL = "http://localhost:3000/api/products";

export const Admin = () => {
  const [products, setProducts] = useState([]);
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

  // ✅ Fetch Products
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Add Product
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
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Delete Product
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

  // ✅ Toggle Bestseller
  const handleToggleBestseller = async (id, currentValue) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBestsellers: !currentValue }),
      });
      if (!res.ok) throw new Error("Failed to update bestseller status");
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

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

        {/* Category */}
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

        {/* Subcategory */}
        <select
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          className="border p-2 rounded"
          disabled={
            !formData.category || !categories[formData.category]?.subcategories?.length
          }
        >
          <option value="">Select Sub Category</option>
          {formData.category &&
            categories[formData.category].subcategories.map((sub) => (
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

      {/* Product List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded shadow p-4 relative">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-40 object-contain transition-transform duration-500 group-hover:scale-105"
                />
              <h3 className="text-lg font-medium mt-2">{product.name}</h3>
              <p className="text-yellow-600 font-bold">₹{product.price}</p>
              <p className="text-sm text-gray-500 capitalize">
                {product.category} → {product.subcategory}
              </p>
              {product.isBestsellers && (
                <span className="absolute top-2  bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Bestseller
                </span>
              )}
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>

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
    </div>
  );
};
