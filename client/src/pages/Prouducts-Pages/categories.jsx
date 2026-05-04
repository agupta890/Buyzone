import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { categories } from "../../data/categories";
import { CartContext } from "../../context/Cart-context";
import { AuthContext } from "../../context/AuthContext";
import { 
  ChevronRight, 
  LayoutGrid, 
  ChevronDown,
  Filter
} from "lucide-react";

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
      let url = `${API_PRODUCTS}?category=${category}&page=${currentPage}&limit=12`;
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
    return <div className="p-20 text-center font-black text-red-500">CATEGORY NOT FOUND</div>;
  }

  const { title, subcategories, image } = categoryData;

  const formattedTitle = subcategory
    ? subcategory
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : title;

  return (
    <div className="min-h-screen bg-white pb-20">
      {loading && page === 1 && <TopProgressBar />}
      
      {/* 1. Category Hero Banner - KEPT EXACTLY AS PLACED */}
      <div className="relative w-full h-64 sm:h-80 md:h-[400px] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-lg">
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Breadcrumbs - Logical Position */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300">
           <Link to="/" className="hover:text-black transition-colors">Home</Link>
           <ChevronRight size={10} />
           <span>{title}</span>
           {subcategory && (
             <>
               <ChevronRight size={10} />
               <span className="text-gray-900">{formattedTitle}</span>
             </>
           )}
        </div>
      </div>

      {/* 3. Professional Subcategory Ribbon (Improved UI & Static Position) */}
      <div className="bg-white border-b border-gray-100 mt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar h-full flex-1 mr-4">
              <Link
                to={`/category/${category}`}
                className={`h-full flex items-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative group ${
                  !subcategory ? "text-black" : "text-gray-400 hover:text-gray-900"
                }`}
              >
                All {title}
                {!subcategory && <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"></span>}
              </Link>

              {subcategories?.map((sub) => {
                const subSlug = sub.toLowerCase().replace(/\s+/g, "-");
                const isActive = subSlug === subcategory;
                return (
                  <Link
                    key={sub}
                    to={`/category/${category}/${subSlug}`}
                    className={`h-full flex items-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative group ${
                      isActive ? "text-black" : "text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {sub}
                    {isActive && <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500"></span>}
                  </Link>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 border-l border-gray-100 pl-6 text-gray-400">
               <span className="text-[10px] font-black uppercase tracking-widest">{products.length} Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {error && (
          <div className="text-center py-20 text-red-500 font-bold">{error}</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
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
          
          {loading && (
            <>
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))}
            </>
          )}
        </div>

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-[2rem]">
             <h3 className="text-gray-400 font-black uppercase tracking-widest text-xs">Collection is being updated.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
