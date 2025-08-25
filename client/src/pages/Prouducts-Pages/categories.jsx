import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categories } from "../../data/categories";
import { CartContext } from "../../context/Cart-context";



const API_URL = "http://localhost:3000/api/products";

// ✅ Reusable Product Card Component
const ProductCard = ({ product }) => {
      const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-amber-300 border-orange-200 rounded-lg shadow hover:shadow-xl transition p-4 flex flex-col items-center">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <div className="text-center">
      <h3 className="font-semibold text-lg ">{product.name}</h3>
      <p className="text-gray-700 mt-2">₹{product.price}</p>
      </div>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};

// ✅ Skeleton Loader
const ProductSkeleton = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
);

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const categoryData = categories[category];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch products
  const fetchProducts = async (controller) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}?category=${category}`;
      if (subcategory) {
        url += `&subCategory=${subcategory.replace("-", " ")}`;
      }

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-fetch when category/subcategory changes
  useEffect(() => {
    if (categoryData) {
      const controller = new AbortController();
      fetchProducts(controller);
      return () => controller.abort(); // cleanup on unmount
    }
  }, [category, subcategory]);

  // ✅ If invalid category
  if (!categoryData) {
    return <h1 className="p-6 text-xl text-red-500">Category not found</h1>;
  }

  const { title, subcategories } = categoryData;

  // ✅ Format title nicely
  const formattedTitle = subcategory
    ? subcategory
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : title;

  return (
    <div className="flex p-6">
      {/* Sidebar */}
      <aside className="w-1/4 mr-6">
        <div className="bg-black text-white rounded-lg shadow-lg p-4">
          <h2 className="font-bold text-lg mb-4">Shop by Category</h2>
          <ul className="space-y-3">
            {/* All option */}
            <li>
              <Link
                to={`/category/${category}`}
                className={`block px-3 py-2 rounded-md ${
                  !subcategory
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-gray-800"
                }`}
              >
                All
              </Link>
            </li>

            {subcategories?.map((sub) => {
              const subSlug = sub.toLowerCase().replace(/\s+/g, "-");
              return (
                <li key={sub}>
                  <Link
                    to={`/category/${category}/${subSlug}`}
                    className={`block px-3 py-2 rounded-md ${
                      subSlug === subcategory
                        ? "bg-white text-black font-semibold"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    {sub}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-3/4">
        <h1 className="text-2xl font-bold mb-6">{formattedTitle}</h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-gray-500">No products available yet.</p>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
