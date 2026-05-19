import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductSkeleton, TopProgressBar } from "../components/LoadingComponents";
import ProductCard from "../components/ProductCard";
import { ShoppingBag, X, SlidersHorizontal, ChevronDown } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchProducts = async (currentPage, query, sortBy) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 9, sort: sortBy });
      if (query) params.set("search", query);
      const res = await fetch(`${API_URL}/api/products?${params}`);
      const data = await res.json();
      const newProducts = data.products || [];
      setProducts(prev => currentPage === 1 ? newProducts : [...prev, ...newProducts]);
      setHasMore(data.currentPage < data.totalPages);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset + fetch on search or sort change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, searchQuery, sort);
  }, [searchQuery, sort]);

  useEffect(() => {
    if (page > 1) fetchProducts(page, searchQuery, sort);
  }, [page]);

  const displayed = inStockOnly ? products.filter(p => p.stock > 0) : products;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {loading && page === 1 && <TopProgressBar />}

      {/* Hero */}
      <div className="relative w-full h-[200px] sm:h-[280px] overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
          alt="Shop All"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent flex flex-col justify-end p-6 md:p-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-amber-500"></span>
              <span className="text-amber-400 font-black uppercase tracking-[0.3em] text-[10px]">Premium Selection</span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter leading-none">
              The <span className="text-amber-500">Collection</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Filter / Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white rounded-2xl border border-slate-100 px-5 py-3 shadow-sm">
          {/* Left: active filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                "{searchQuery}"
                <button onClick={() => setSearchParams({})} className="hover:text-amber-900 transition-colors">
                  <X size={12} />
                </button>
              </span>
            )}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setInStockOnly(v => !v)}
                className={`w-9 h-5 rounded-full transition-colors relative ${inStockOnly ? "bg-amber-600" : "bg-slate-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${inStockOnly ? "translate-x-4" : ""}`} />
              </div>
              <span className="text-xs font-semibold text-slate-600">In Stock Only</span>
            </label>
            {!loading && (
              <span className="text-xs text-slate-400 font-medium">{displayed.length} products</span>
            )}
          </div>

          {/* Right: sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grid */}
        {displayed.length === 0 && !loading ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : "No products yet."}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchParams({})} className="mt-4 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((product, index) => {
              const isLast = displayed.length === index + 1;
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  ref={isLast && !inStockOnly ? lastProductElementRef : null}
                />
              );
            })}
            {loading && [...Array(3)].map((_, i) => <ProductSkeleton key={`sk-${i}`} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopAll;
