import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ArrowRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductSkeleton } from './LoadingComponents';

const TrendingSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${baseUrl}/api/products?limit=8`);
        const data = await res.json();
        setProducts(data.products || (Array.isArray(data) ? data : []));
      } catch (err) {
        console.error("Trending load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row items-end justify-between mb-12 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
            <Flame size={16} className="fill-current" />
            <span>Top Picks</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            Trending <span className="text-orange-500 italic">Now</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-lg max-w-xl font-medium">
            Explore our most popular items that the community is loving right now.
          </p>
        </div>
        <Link 
          to="/shop-all" 
          className="group flex items-center gap-2 text-slate-900 font-black text-sm sm:text-base uppercase tracking-widest hover:text-orange-500 transition-colors"
        >
          View All <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
