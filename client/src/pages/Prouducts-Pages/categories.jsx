import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { categories } from "../../data/categories";
import { CartContext } from "../../context/Cart-context";
import { AuthContext } from "../../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;



const API_PRODUCTS = `${API_URL}/api/products`;


import ProductCard from "../../components/ProductCard";
import { ProductSkeleton, TopProgressBar } from "../../components/LoadingComponents";

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const categoryData = categories[category];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // ✅ Fetch products
  const fetchProducts = async (currentPage, isNewCategory = false) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_PRODUCTS}?category=${category}&page=${currentPage}&limit=6`;
      if (subcategory) {
        url += `&subCategory=${subcategory.replace("-", " ")}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();
      const newProducts = data.products || [];
      
      setProducts(prev => isNewCategory ? newProducts : [...prev, ...newProducts]);
      setHasMore(data.currentPage < data.totalPages);
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
      setProducts([]);
      setPage(1);
      setHasMore(true);
      fetchProducts(1, true);
    }
  }, [category, subcategory]);

  // ✅ Fetch more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page);
    }
  }, [page]);

  // ✅ If invalid category
  if (!categoryData) {
    return <h1 className="p-6 text-xl text-red-500">Category not found</h1>;
  }

  const { title, subcategories, image, subtitle, color } = categoryData;

  // ✅ Format title nicely
  const formattedTitle = subcategory
    ? subcategory
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : title;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {loading && <TopProgressBar />}
      
      {/* Category Hero Banner */}
      {!subcategory && (
        <div className="relative w-full h-64 sm:h-80 md:h-[400px] overflow-hidden mb-8">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transform scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16">
            <div className="max-w-7xl mx-auto w-full">
              <span className={`inline-block px-4 py-1 rounded-full text-white text-xs font-black uppercase tracking-widest mb-4 bg-gradient-to-r ${color || 'from-amber-500 to-orange-400'} shadow-lg`}>
                {subtitle || "Premium Collection"}
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-2">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sticky top-24 border border-slate-100">
            <h2 className="font-black text-slate-900 text-xl mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
              Collections
            </h2>

            <ul className="flex flex-wrap lg:flex-col gap-2">
              <li>
                <Link
                  to={`/category/${category}`}
                  className={`w-full px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm flex items-center justify-between group ${
                    !subcategory
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-2"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:translate-x-1"
                  }`}
                >
                  All {title}
                  <span className={`w-2 h-2 rounded-full ${!subcategory ? 'bg-amber-400 animate-pulse' : 'bg-transparent group-hover:bg-slate-300'}`}></span>
                </Link>
              </li>

              {subcategories?.map((sub) => {
                const subSlug = sub.toLowerCase().replace(/\s+/g, "-");
                const isActive = subSlug === subcategory;
                return (
                  <li key={sub} className="w-full">
                    <Link
                      to={`/category/${category}/${subSlug}`}
                      className={`w-full px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm flex items-center justify-between group ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-2"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:translate-x-1"
                      }`}
                    >
                      {sub}
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-400 animate-pulse' : 'bg-transparent group-hover:bg-slate-300'}`}></span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              {formattedTitle}
              <span className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {products.length} Products
              </span>
            </h1>
          </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {products.map((p, index) => {
              const isLastElement = products.length === index + 1;
              return (
                <ProductCard 
                  key={p._id} 
                  product={p} 
                  ref={isLastElement ? lastProductElementRef : null} 
                />
              );
            })}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-gray-500">No products available yet.</p>
        )}
      </main>
    </div>
  </div>
  );
};

export default CategoryPage;
