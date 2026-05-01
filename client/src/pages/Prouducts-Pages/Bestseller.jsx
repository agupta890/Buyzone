import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { CartContext } from "../../context/Cart-context";
import { Link } from "react-router-dom";
import { ProductSkeleton, TopProgressBar } from "../../components/LoadingComponents";
import ProductCard from "../../components/ProductCard";
import { Zap, Award, ArrowRight } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const API_PRODUCTS = `${API_URL}/api/products`;

export const BestSeller = () => {
  const [bestsellers, setBestsellers] = useState([]);
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

  const fetchBestsellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      // Fetch all products and filter on client to be 100% sure we catch them
      const res = await fetch(`${baseUrl}/api/products?limit=100`);
      
      if (!res.ok) throw new Error("Failed to connect to server");
      
      const data = await res.json();
      const productsArray = data.products || (Array.isArray(data) ? data : []);
      
      // Filter for bestsellers on the client side
      const filtered = productsArray.filter(p => p.isBestsellers === true);
      
      setBestsellers(filtered);
      setHasMore(false); // Disable infinite scroll for now
      
    } catch (err) {
      console.error("Bestsellers load error:", err);
      setError("Unable to load bestsellers. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  return (
    <div className="bg-[#FBFBFB] min-h-screen pb-20">
      {loading && page === 1 && <TopProgressBar />}
      
      {/* Hero Section */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden mb-12">
        <img 
          src="https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=2000&auto=format&fit=crop" 
          alt="Bestsellers" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-7xl mx-auto w-full text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-4 bg-amber-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-500/30">
              <Award size={14} className="text-amber-400" />
              <span className="text-amber-400 font-black uppercase tracking-[0.2em] text-[10px]">
                Top Rated by Community
              </span>
            </div>
            <h1 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4">
              The <span className="text-amber-500 italic">Bestsellers</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg max-w-xl font-medium leading-relaxed mx-auto md:mx-0">
              Our most coveted pieces, chosen by our discerning community for their peerless quality and iconic design.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {error && (
          <div className="text-center py-10 bg-red-50 rounded-3xl border border-red-100 text-red-600 font-bold">
            {error}
          </div>
        )}
        
        {bestsellers.length === 0 && !loading && !error && (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <Zap size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Our bestsellers are being updated. Check back soon!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6">
          {bestsellers.map((product, index) => {
            const isLastElement = bestsellers.length === index + 1;
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
      </div>
    </div>
  );
};
