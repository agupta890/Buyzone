import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { useFlashSale } from "../context/FlashSaleContext";
import { ShoppingCart, Eye, CheckCircle, Zap } from "lucide-react";

const ProductCard = React.forwardRef(({ product }, ref) => {
  const { addToCart, cart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const { getSalePrice, getDiscount, isSaleActive } = useFlashSale();
  const navigate = useNavigate();

  const isInCart = cart.some(i => i.product._id === product._id);
  const isOutOfStock = product.stock <= 0;

  const salePrice = getSalePrice(product);
  const saleDiscount = getDiscount(product);
  const onSale = isSaleActive() && saleDiscount > 0;

  // Fake MRP only shown when NOT on a real flash sale
  const fakeOriginal = product.price + 500;
  const displayOriginal = onSale ? product.price : fakeOriginal;
  const displayPrice = onSale ? salePrice : product.price;
  const displayDiscount = onSale ? saleDiscount : Math.round(((fakeOriginal - product.price) / fakeOriginal) * 100);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!auth?.user?._id) { navigate("/login"); return; }
    if (isInCart) { navigate("/cart"); return; }
    await addToCart(product);
  };

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

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {isOutOfStock ? (
              <span className="bg-gray-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                Out of Stock
              </span>
            ) : (
              <>
                {onSale && (
                  <span className="bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider flex items-center gap-0.5">
                    <Zap size={8} className="fill-current" /> Sale
                  </span>
                )}
                {product.isBestsellers && (
                  <span className="bg-yellow-400 text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                    Best
                  </span>
                )}
                {product.stock <= 5 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
                    Only {product.stock} left!
                  </span>
                )}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider ${onSale ? "bg-amber-500 text-black" : "bg-white text-red-600"}`}>
                  {displayDiscount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Quick Actions Overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <div className="bg-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-yellow-500 hover:text-white">
                <Eye size={16} />
              </div>
              <button
                onClick={handleAdd}
                className={`${isInCart ? "bg-green-500" : "bg-gray-900 hover:bg-yellow-500"} text-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 active:scale-95`}
              >
                {isInCart ? <CheckCircle size={16} /> : <ShoppingCart size={16} />}
              </button>
            </div>
          )}
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
              <span className={`text-base font-bold leading-none ${onSale ? "text-amber-600" : "text-gray-900"}`}>
                ₹{displayPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 line-through mt-0.5 font-medium">
                ₹{displayOriginal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded">
                <span className="text-[10px] font-bold text-green-700">4.5</span>
                <svg className="w-2 h-2 fill-green-700 text-green-700" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isInCart
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white p-2 rounded-lg shadow-sm transition-all active:scale-90 flex items-center justify-center`}
                aria-label={isOutOfStock ? "Out of Stock" : isInCart ? "Go to Cart" : "Add to Cart"}
              >
                {isInCart ? <CheckCircle size={15} /> : <ShoppingCart size={15} />}
              </button>
            </div>
          </div>

          {isInCart && !isOutOfStock && (
            <button
              onClick={handleAdd}
              className="mt-2 w-full text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg py-1.5 hover:bg-green-100 transition-colors"
            >
              Go to Cart →
            </button>
          )}
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
