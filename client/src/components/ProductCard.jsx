import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, Eye } from "lucide-react";

const ProductCard = React.forwardRef(({ product }, ref) => {
  const { addToCart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth?.user?._id) {
      navigate("/login");
      return;
    }
    setIsAdding(true);
    await addToCart(product);
    setTimeout(() => setIsAdding(false), 2000);
  };

  const originalPrice = product.price + 500;
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div 
      ref={ref} 
      className="group relative bg-white rounded-xl border border-gray-100 flex flex-col overflow-hidden hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] transition-all duration-500"
    >
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
        {/* Image Area */}
        <div className="relative aspect-[4/5] w-full bg-[#F8F8F8] flex items-center justify-center p-10 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badge Section */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.isBestsellers && (
              <span className="bg-yellow-400 text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                Best
              </span>
            )}
            <span className="bg-white text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
             <div className="bg-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-yellow-500 hover:text-white transition-colors">
                <Eye size={16} />
             </div>
             <button 
               onClick={handleAdd}
               disabled={isAdding}
               className={`${
                 isAdding ? "bg-green-500" : "bg-gray-900 hover:bg-yellow-500"
               } text-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 active:scale-95`}
             >
                {isAdding ? (
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <ShoppingCart size={16} />
                )}
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 flex flex-col flex-1">
          <div className="flex-1 mb-2">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">
              {product.category || "Premium"}
            </span>
            <h3 className="font-semibold text-gray-800 text-xs leading-tight line-clamp-2 transition-colors group-hover:text-yellow-600">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 leading-none">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 line-through mt-0.5 font-medium">
                ₹{originalPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
                <span className="text-[10px] font-bold text-green-700">4.5</span>
                <svg className="w-2 h-2 fill-green-700 text-green-700" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              {/* Permanent Mobile-Friendly Add to Cart Button */}
              <button
                onClick={handleAdd}
                disabled={isAdding}
                className={`${
                  isAdding ? "bg-green-500" : "bg-yellow-500 hover:bg-yellow-600"
                } text-white p-2 rounded-lg shadow-sm transition-all active:scale-90 flex items-center justify-center`}
                aria-label="Add to Cart"
              >
                {isAdding ? (
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <ShoppingCart size={15} />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
