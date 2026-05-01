import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { ProductSkeleton, TopProgressBar } from "../components/LoadingComponents";
import ProductCard from "../components/ProductCard";
import { ShoppingBag, Zap, ArrowRight } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchProducts = async (currentPage) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products?page=${currentPage}&limit=6`);
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

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div className="bg-[#FBFBFB] min-h-screen pb-20">
      {loading && page === 1 && <TopProgressBar />}
      
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop" 
          alt="Shop All" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[2px] w-8 bg-amber-500 rounded-full"></span>
              <span className="text-amber-400 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
                Premium Selection
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
              The <span className="text-amber-500">Collection</span>
            </h1>
            <p className="text-gray-200 text-sm sm:text-lg max-w-xl font-medium leading-relaxed">
              Explore our complete range of high-end essentials, curated for those who demand excellence in every detail.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {products.length === 0 && !loading ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6">
            {products.map((product, index) => {
              const isLastElement = products.length === index + 1;
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  ref={isLastElement ? lastProductElementRef : null}
                />
              );
            })}
            {loading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <ProductSkeleton key={`skeleton-${i}`} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopAll;
