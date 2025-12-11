import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { categories } from "../../data/categories";
import { CartContext } from "../../context/Cart-context";
import { AuthContext } from "../../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;



const API_PRODUCTS = `${API_URL}/api/products`;


// ✅ Reusable Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!auth?.user?._id) {
      navigate("/login"); // 🚀 redirect if guest
      return;
    }
    addToCart(product);
  };

  

  return (
    <div className="group relative bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
  <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
    {/* Product Image */}
    <div className="relative w-full h-48 flex items-center justify-center p-4">
      <img
        src={product.image}
        alt={product.name}
        className="max-h-36 object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    {/* Product Info */}
    <div className="px-4 pb-4 flex flex-col text-left">
      <h3 className="font-medium text-sm text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
        {product.name}
      </h3>
      <p className="text-lg font-bold text-gray-900 mt-1">₹{product.price}</p>
    </div>
  </Link>

  {/* Add to Cart Button */}
  <div className="px-4 pb-4">
    <button
      className="w-full bg-green-900 text-white text-sm font-semibold px-3 py-2 rounded-md hover:bg-orange-600 active:scale-95 transition"
      onClick={handleAdd}
    >
      ADD TO CART
    </button>
  </div>
</div>


  );
};

// ✅ Skeleton Loader
const ProductSkeleton = () => (
  <div className="bg-gray-200 animate-pulse rounded-2xl h-64"></div>
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
      let url = `${API_PRODUCTS}?category=${category}`;
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
    <div className="flex flex-col lg:flex-row p-6 gap-6">
      {/* Categories */}
      <aside className="w-full lg:w-1/4">
        <div className="bg-black text-white rounded-2xl shadow-lg p-4">
          {/* Heading only on large screen */}
          <h2 className="font-bold text-lg mb-4 hidden lg:block">
            Shop by Category
          </h2>

          {/* Category List */}
          <ul className="flex flex-wrap lg:flex-col gap-2 lg:gap-3">
            {/* All option */}
            <li>
              <Link
                to={`/category/${category}`}
                className={`px-4 py-2 rounded-full transition-all duration-300 inline-block ${
                  !subcategory
                    ? "bg-white text-black font-semibold shadow-md"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                All
              </Link>
            </li>

            {subcategories?.map((sub) => {
              const subSlug = sub.toLowerCase().replace(/\s+/g, "-");
              return (
                <li key={sub} className="inline-block">
                  <Link
                    to={`/category/${category}/${subSlug}`}
                    className={`px-4 py-2 rounded-full transition-all duration-300 inline-block ${
                      subSlug === subcategory
                        ? "bg-white text-black font-semibold shadow-md"
                        : "bg-gray-800 hover:bg-gray-700"
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
      <main className="w-full lg:w-3/4">
        {/* ✅ Updated Styled Heading */}
        <h1
          className="text-2xl md:text-3xl font-bold text-[#384959] mb-6 flex items-center gap-3 border-b-2 border-gray-200 pb-2"
        >
          <span className="bg-[#384959] text-white px-4 py-1 rounded-md shadow">
    {formattedTitle}
  </span>
        
         
        </h1>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
