import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { useFlashSale } from "../context/FlashSaleContext";
import { ShoppingCart, CheckCircle, Zap } from "lucide-react";
import { PLACEHOLDER_IMAGE, onImageError } from "../utils/imageFallback";

const ProductCard = React.forwardRef(({ product }, ref) => {
  const { addToCart, cart } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const { getSalePrice, getDiscount, isSaleActive } = useFlashSale();
  const navigate = useNavigate();

  const isInCart = cart.some((i) => i.product._id === product._id);
  const isOutOfStock = product.stock <= 0;

  const saleDiscount = getDiscount(product);
  const onSale = isSaleActive() && saleDiscount > 0;
  const salePrice = onSale ? getSalePrice(product) : null;

  const fakeOriginal = product.price + 500;
  const displayPrice = onSale ? salePrice : product.price;
  const displayOriginal = onSale ? product.price : fakeOriginal;
  const displayDiscount = onSale
    ? saleDiscount
    : Math.round(((fakeOriginal - product.price) / fakeOriginal) * 100);

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
      className="group relative bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
    >
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/5] w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
          <img
            src={product.image || PLACEHOLDER_IMAGE}
            onError={onImageError}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOutOfStock ? (
              <span className="bg-slate-800 text-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Sold Out
              </span>
            ) : (
              <>
                {onSale && (
                  <span className="bg-amber-500 text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                    <Zap size={7} className="fill-current" /> Sale
                  </span>
                )}
                {product.isBestsellers && (
                  <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Top Pick
                  </span>
                )}
                {!onSale && product.stock > 0 && product.stock <= 5 && (
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {product.stock} left
                  </span>
                )}
              </>
            )}
          </div>

          {/* Discount badge top-right */}
          {!isOutOfStock && (
            <span className={`absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${onSale ? "bg-amber-500 text-slate-900" : "bg-slate-100 text-slate-600"}`}>
              -{displayDiscount}%
            </span>
          )}

          {/* Quick-add overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
              <button
                onClick={handleAdd}
                className={`${isInCart ? "bg-emerald-600" : "bg-slate-900 hover:bg-amber-600"} text-white text-xs font-bold px-5 py-2 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2`}
              >
                {isInCart ? <><CheckCircle size={13} /> In Cart</> : <><ShoppingCart size={13} /> Add to Cart</>}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1 mb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              {product.category || "Premium"}
            </span>
            <h3 className="font-semibold text-slate-800 text-[13px] leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className={`text-base font-black leading-none ${onSale ? "text-amber-600" : "text-slate-900"}`}>
                ₹{displayPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 line-through ml-1.5 font-medium">
                ₹{displayOriginal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`p-2 rounded-xl shadow-sm transition-all active:scale-90 ${
                isOutOfStock
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : isInCart
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200"
              }`}
              aria-label={isOutOfStock ? "Out of Stock" : isInCart ? "In Cart" : "Add to Cart"}
            >
              {isInCart ? <CheckCircle size={15} /> : <ShoppingCart size={15} />}
            </button>
          </div>

          {isInCart && !isOutOfStock && (
            <button
              onClick={handleAdd}
              className="mt-2.5 w-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl py-1.5 hover:bg-emerald-100 transition-colors"
            >
              View Cart →
            </button>
          )}
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
