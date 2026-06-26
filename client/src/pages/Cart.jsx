import { useContext, useState, memo, useMemo, useEffect } from "react";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { AddressPage } from "./AddressPage";
import { useNavigate, Link } from "react-router-dom";
import RecentlyViewed from "./RecentlyViewed";
import { toast } from "react-toastify";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { PLACEHOLDER_IMAGE, onImageError } from "../utils/imageFallback";
const API_URL = import.meta.env.VITE_API_URL;

const CartItem = memo(({ item, increaseQty, decreaseQty, removeFromCart }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-slate-100 last:border-0 group">
    {/* Image & Info Row */}
    <div className="flex items-center gap-4 flex-1 w-full">
      <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
        <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-2 overflow-hidden">
          <img
            src={item.product.image || PLACEHOLDER_IMAGE}
            onError={onImageError}
            alt={item.product.name}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/product/${item.product._id}`}>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-amber-600 transition-colors">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-400 mt-0.5">{item.product.category || "Product"}</p>
        <p className="text-base font-black text-slate-900 mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</p>
      </div>
    </div>

    {/* Controls Row */}
    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pl-24 sm:pl-0">
      <div className="flex items-center gap-1 bg-slate-50 rounded-full border border-slate-200 p-1">
        <button
          onClick={() => decreaseQty(item.product._id)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors text-slate-600 active:scale-90"
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-sm font-black text-slate-800">{item.quantity}</span>
        <button
          onClick={() => increaseQty(item.product._id)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors text-slate-600 active:scale-90"
        >
          <Plus size={12} />
        </button>
      </div>
      <button
        onClick={() => removeFromCart(item.product._id)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all sm:opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={15} />
      </button>
    </div>
  </div>
));

export const Cart = () => {
  const { cart, loading, removeFromCart, increaseQty, decreaseQty, getTotal, clearCart } =
    useContext(CartContext);
  const { auth, refreshUser } = useContext(AuthContext);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();

  const [cashbackOffer, setCashbackOffer] = useState(null);
  const [useCoins, setUseCoins] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/cashback-offer`)
      .then((r) => r.json())
      .then((data) => setCashbackOffer(data))
      .catch(() => {});
  }, []);

  const totalAmount = useMemo(() => getTotal(), [getTotal]);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const userCoins = auth?.user?.cashbackCoins || 0;
  const coinDiscount = useCoins ? Math.min(userCoins, totalAmount) : 0;
  const payableAmount = totalAmount - coinDiscount;

  const coinsEarned = useMemo(() => {
    if (!cashbackOffer || !cashbackOffer.isActive) return 0;
    const amountToCheck = totalAmount;
    if (amountToCheck >= cashbackOffer.maxPurchase) {
      return Math.round(amountToCheck * (cashbackOffer.maxCashbackPercent / 100));
    } else if (amountToCheck >= cashbackOffer.midPurchase) {
      return Math.round(amountToCheck * (cashbackOffer.midCashbackPercent / 100));
    } else if (amountToCheck >= cashbackOffer.minPurchase) {
      return Math.round(amountToCheck * (cashbackOffer.minCashbackPercent / 100));
    }
    return 0;
  }, [cashbackOffer, totalAmount]);

  if (loading && cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-amber-500"></div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.warn("Please select a delivery address first");
      return;
    }

    if (payableAmount === 0) {
      if (!window.confirm(`Use 🪙 ${totalAmount} Buyzone Coins to place this order?`)) return;
      try {
        const formattedItems = cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price || item.product.price || 0,
        }));

        const res = await fetch(`${API_URL}/api/orders`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: formattedItems,
            total: 0,
            address_id: selectedAddressId,
            coinsUsed: totalAmount,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order placement failed");

        toast.success("Order placed successfully using Buyzone Coins!");
        await refreshUser();
        await clearCart();
        navigate("/orders");
      } catch (err) {
        toast.error(err.message || "Checkout failed");
      }
      return;
    }

    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      }).catch(() => toast.error("Failed to load payment SDK"));
    }

    try {
      const res = await fetch(`${API_URL}/api/payments/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payableAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const { order, key_id } = data;
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address_id: selectedAddressId,
              cart,
              total: payableAmount,
              coinsUsed: coinDiscount,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            toast.success("Payment successful! Order placed.");
            await refreshUser();
            await clearCart();
            navigate("/orders");
          } else {
            toast.error("Payment verification failed: " + (verifyData.error || "Unknown error"));
          }
        },
        modal: { ondismiss: () => toast.info("Payment cancelled") },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.message || "Checkout failed");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Shopping Cart</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link to="/shop-all" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            Continue Shopping →
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-20 px-6">
            <ShoppingBag size={56} className="mx-auto text-slate-200 mb-4" />
            <h2 className="text-xl font-black text-slate-800 mb-2">Your cart is empty</h2>
            <p className="text-slate-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
            <Link
              to="/shop-all"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-95"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Items */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-black text-slate-800">Items</h2>
                  <button
                    onClick={() => { if (window.confirm("Clear all items from cart?")) clearCart(); }}
                    className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                {cart.map(item => (
                  <CartItem
                    key={item.product._id}
                    item={item}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <AddressPage onSelectAddress={setSelectedAddressId} />
              </div>

              {/* Recently Viewed */}
              <div>
                <RecentlyViewed />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit space-y-3">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-black text-slate-800 mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-slate-900">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  {coinDiscount > 0 && (
                    <div className="flex justify-between text-amber-600 font-extrabold">
                      <span>Coin Discount</span>
                      <span>-₹{coinDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-black text-slate-900">Total Payable</span>
                    <span className="font-black text-slate-900 text-lg">₹{payableAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cashback Coins Checkbox & Summary */}
                {auth?.user && userCoins > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={useCoins}
                        onChange={(e) => setUseCoins(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500/20"
                      />
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        Use Buyzone Coins <span className="text-amber-500 font-black">(Available: 🪙 {userCoins})</span>
                      </span>
                    </label>
                  </div>
                )}

                {/* Cashback Coins Earn Info */}
                {coinsEarned > 0 && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                    <p className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1">
                      🎉 You will earn 🪙 {coinsEarned} Coins from this order!
                    </p>
                  </div>
                )}

                {/* Coupon placeholder */}
                <div className="mt-4 flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
                  <Tag size={14} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none"
                    disabled
                  />
                  <button disabled className="text-xs font-bold text-slate-400">Apply</button>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-5 w-full bg-slate-900 hover:bg-amber-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                  Secured by Razorpay · SSL Encrypted
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
