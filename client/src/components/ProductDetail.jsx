import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import BuyButton from "./BuyButton";
import { Star, ShieldCheck, Truck, RotateCcw, ChevronLeft, ShoppingCart, Sparkles } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product);
    setTimeout(() => setIsAdding(false), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`, { credentials: "include" });
      
        if (!res.ok) throw new Error("Failed to fetch product details");
        const data = await res.json();
        setProduct(data);
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      let recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
      recent = recent.filter((p) => p._id !== product._id);
      recent.unshift(product);
      if (recent.length > 6) recent.pop();
      localStorage.setItem("recentlyViewed", JSON.stringify(recent));
    }
  }, [product]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FBFBFB]">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBFBFB] p-6 text-center">
       <div className="bg-rose-50 text-rose-500 p-6 rounded-3xl mb-4 border border-rose-100 max-w-md">
         <h2 className="text-xl font-black mb-2 uppercase tracking-widest">Error Loading Product</h2>
         <p className="font-medium">{error}</p>
       </div>
       <Link to="/shop-all" className="bg-slate-900 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all">Back to Collection</Link>
    </div>
  );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans text-slate-900 pb-20 lg:pb-0">
      
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link to={-1} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-amber-600 transition-colors">
          <ChevronLeft size={16} /> Back to previous
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-6">
        
        {/* Left: Product Image Gallery */}
        <div className="relative">
          <div className="aspect-square bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 flex items-center justify-center p-12 relative group overflow-hidden border border-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110"
            />
            {/* Discount Badge */}
            <div className="absolute top-8 left-8 bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
              10% OFF
            </div>
          </div>
          
          {/* Trust Highlights on Mobile */}
          <div className="grid grid-cols-3 gap-4 mt-8 lg:hidden">
             <div className="bg-white p-4 rounded-2xl text-center border border-gray-100">
               <ShieldCheck className="mx-auto text-amber-500 mb-2" size={20} />
               <p className="text-[10px] font-black uppercase tracking-widest">Secure</p>
             </div>
             <div className="bg-white p-4 rounded-2xl text-center border border-gray-100">
               <Truck className="mx-auto text-amber-500 mb-2" size={20} />
               <p className="text-[10px] font-black uppercase tracking-widest">Fast</p>
             </div>
             <div className="bg-white p-4 rounded-2xl text-center border border-gray-100">
               <RotateCcw className="mx-auto text-amber-500 mb-2" size={20} />
               <p className="text-[10px] font-black uppercase tracking-widest">Returns</p>
             </div>
          </div>
        </div>

        {/* Right: Premium Details */}
        <div className="flex flex-col">
          <div className="mb-8">
            <span className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
              {product.category || "Premium Collection"}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none text-slate-900 mb-4">
              {product.name}
            </h1>
            
            {/* Ratings Summary */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-black">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                4.3
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                2,100 Verified Reviews
              </span>
            </div>
          </div>

          {/* Pricing Architecture */}
          <div className="mb-10 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-200/30">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-5xl font-black tracking-tighter text-slate-900">
                ₹{product.price}
              </span>
              <span className="text-xl font-bold text-slate-300 line-through">
                ₹{product.price + 500}
              </span>
            </div>
            <p className="text-amber-600 font-black text-[10px] uppercase tracking-widest">
              Price inclusive of all taxes
            </p>
          </div>

          {/* Description & Specs */}
          <div className="space-y-8 mb-12">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">The Detail</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {product.description || "No specific description provided for this product. Crafted with the highest quality materials and designed for durability and style."}
              </p>
            </div>

            {/* Exclusive Offers */}
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem]">
               <h4 className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-widest mb-4">
                 <Sparkles size={16} /> Member Benefits
               </h4>
               <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-sm font-bold text-amber-800">
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                   10% Instant Credit with ICICI Cards
                 </li>
                 <li className="flex items-center gap-3 text-sm font-bold text-amber-800">
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                   Complimentary Gift Wrapping available
                 </li>
               </ul>
            </div>
          </div>

          {/* Actions: Grid layout */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex items-center justify-center gap-3 font-black px-8 py-5 rounded-2xl transition-all shadow-2xl active:scale-95 group uppercase tracking-widest text-xs ${
                isAdding ? "bg-amber-500 text-black" : "bg-slate-900 text-white hover:bg-amber-500 shadow-slate-900/10"
              }`}
            >
              {isAdding ? (
                <>Adding...</>
              ) : (
                <>
                  <ShoppingCart size={18} className="group-hover:animate-bounce" /> Add to Cart
                </>
              )}
            </button>
            <BuyButton product={product}/>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 p-5 flex gap-4 z-[1000] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex-1 flex items-center justify-center gap-2 font-black px-6 py-4 rounded-2xl text-[11px] uppercase tracking-widest active:scale-95 transition-all ${
            isAdding ? "bg-amber-500 text-black" : "bg-slate-100 text-slate-900"
          }`}
        >
          {isAdding ? "Adding..." : <><ShoppingCart size={16} /> Cart</>}
        </button>
        <div className="flex-[1.5]">
           <BuyButton product={product}/>
        </div>
      </div>

    </div>
  );
};
