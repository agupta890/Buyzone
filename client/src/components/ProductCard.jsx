import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard = React.forwardRef(({ product }, ref) => {
  const { addToCart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!auth?.user?._id) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  return (
    <div 
      ref={ref} 
      className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col overflow-hidden"
    >
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
        {/* Image Area */}
        <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
             <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Eye size={20} className="text-slate-900" />
             </div>
          </div>

          {/* Tag */}
          {product.isBestsellers && (
            <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Bestseller
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex-1">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 opacity-80">
              {product.category || "Premium Edit"}
            </p>
            <h3 className="font-bold text-slate-900 leading-tight line-clamp-2 transition-colors group-hover:text-amber-600">
              {product.name}
            </h3>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">₹{product.price}</p>
              <p className="text-[10px] text-slate-400 font-bold line-through italic opacity-60">₹{product.price + 500}</p>
            </div>
            
            <button
              onClick={handleAdd}
              className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-amber-500 transition-all active:scale-90 shadow-xl shadow-slate-200 active:shadow-none group/btn"
              title="Add to Cart"
            >
              <ShoppingCart size={18} className="group-hover/btn:animate-bounce" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
