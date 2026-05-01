import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, MapPin, CreditCard } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const OrderSkeleton = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-sm animate-pulse">
    <div className="flex justify-between items-start border-b border-slate-50 pb-4">
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded w-48"></div>
        <div className="h-3 bg-slate-50 rounded w-32"></div>
      </div>
      <div className="h-8 bg-slate-100 rounded-full w-24"></div>
    </div>
    <div className="flex gap-4">
      <div className="w-24 h-24 bg-slate-100 rounded-2xl"></div>
      <div className="flex-1 space-y-2 py-2">
        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
        <div className="h-3 bg-slate-50 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <CheckCircle size={16} className="text-emerald-500" />;
      case "Shipped": return <Truck size={16} className="text-amber-500" />;
      case "Processing": return <Clock size={16} className="text-blue-500" />;
      case "Cancelled": return <XCircle size={16} className="text-rose-500" />;
      default: return <Package size={16} className="text-slate-400" />;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Shipped": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Processing": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Cancelled": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-md border border-slate-100">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <XCircle size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Failed to load orders</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-amber-500 transition-all">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[2px] w-8 bg-amber-500 rounded-full"></span>
              <span className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px]">History</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
              My <span className="text-amber-500">Orders</span>
            </h1>
          </div>
          <div className="bg-white px-6 py-2 rounded-2xl border border-slate-100 shadow-sm text-sm font-bold text-slate-500">
            {orders.length} total orders
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto font-medium">It looks like you haven't placed any orders yet. Start your journey today!</p>
            <a href="/shop-all" className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-full font-black hover:bg-amber-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
              Start Shopping <ChevronRight size={18} />
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const { _id, items, total, status, payment_method, createdAt, address_id } = order;

              return (
                <div key={_id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                  {/* Order Top Bar */}
                  <div className="bg-slate-50/50 px-6 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Identifier</p>
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        #{_id.slice(-8).toUpperCase()}
                        <span className="text-slate-300 font-medium">|</span>
                        <span className="text-slate-500">{new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${getStatusStyles(status)} text-xs font-black uppercase tracking-wider shadow-sm`}>
                      {getStatusIcon(status)}
                      {status}
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6 sm:p-8">
                    <div className="space-y-6">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 sm:gap-6 group">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 flex-shrink-0">
                            <img 
                              src={item.product?.image || "/placeholder.png"} 
                              alt={item.product?.name} 
                              className="max-h-full max-w-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="flex-1 py-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">{item.product?.name || "Product Archive"}</h4>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Qty: {item.quantity}</p>
                            <p className="text-lg font-black text-slate-900 mt-2">₹{item.price?.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Footer */}
                    <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Shipping Info */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 text-slate-400">
                          <MapPin size={20} />
                        </div>
                        <div className="text-sm">
                          <p className="font-black text-slate-900 mb-1">Shipping Address</p>
                          {address_id ? (
                            <p className="text-slate-500 font-medium leading-relaxed">
                              {address_id.name}<br />
                              {address_id.house_no}, {address_id.street}<br />
                              {address_id.city}, {address_id.pincode}
                            </p>
                          ) : (
                            <p className="text-slate-400 italic">Address details unavailable</p>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-slate-50/50 rounded-3xl p-6 flex flex-col justify-between">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                              <CreditCard size={20} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                               <p className="font-bold text-slate-900">{payment_method || "COD"}</p>
                            </div>
                         </div>
                         <div className="flex justify-between items-end">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                               <p className="text-2xl font-black text-slate-900">₹{total?.toFixed(2)}</p>
                            </div>
                            <button className="bg-white border border-slate-200 text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                              Order Detail
                            </button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
