import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, MapPin, CreditCard } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const OrderSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-100 p-6 space-y-4 shadow-sm animate-pulse">
    <div className="flex gap-4">
      <div className="w-20 h-20 bg-gray-100 rounded"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-3 bg-gray-50 rounded w-1/4"></div>
      </div>
      <div className="w-32 h-8 bg-gray-100 rounded-full hidden md:block"></div>
    </div>
  </div>
);

const OrderTracking = ({ status }) => {
  const steps = ["Ordered", "Packed", "Shipped", "Delivered"];
  
  const getActiveStep = () => {
    if (status === "Cancelled") return -1;
    switch (status) {
      case "Delivered": return 3;
      case "Shipped": return 2;
      case "Processing": return 1;
      default: return 0;
    }
  };

  const activeStep = getActiveStep();

  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 text-xs font-bold mt-4">
        <XCircle size={16} />
        <span>Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4 mt-2">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-[10px] w-full h-[2px] bg-gray-100 -z-0" />
        <div 
          className="absolute left-0 top-[10px] h-[2px] bg-green-500 transition-all duration-700 ease-in-out z-0"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= activeStep;
          const isCurrent = index === activeStep;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-[22px] h-[22px] rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                  isCompleted 
                    ? "bg-green-500 border-green-100" 
                    : "bg-white border-gray-100"
                } ${isCurrent ? "ring-4 ring-green-50" : ""}`}
              >
                {isCompleted && <CheckCircle size={10} className="text-white" />}
              </div>
              <span 
                className={`text-[9px] font-bold mt-2 uppercase tracking-tighter transition-colors duration-500 ${
                  isCompleted ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lazy Loading State
  const [visibleCount, setVisibleCount] = useState(5);
  const loaderRef = React.useRef(null);

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

  // Intersection Observer for Lazy Loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < orders.length) {
          setVisibleCount((prev) => prev + 5);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [orders.length, visibleCount]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered": return "text-green-600 bg-green-50 border-green-100";
      case "Shipped": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Processing": return "text-orange-600 bg-orange-50 border-orange-100";
      case "Cancelled": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-gray-200">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error loading orders</h2>
        <p className="text-gray-500 mb-6 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F3F6] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-500 text-sm">{orders.length} orders found</p>
          </div>
          <a href="/shop-all" className="text-sm font-bold text-blue-600 hover:underline">Continue Shopping</a>
        </header>

        {loading ? (
          <div className="space-y-4">
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <Package size={64} className="mx-auto text-gray-100 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No orders placed yet</h3>
            <a href="/shop-all" className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-md">Shop Now</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, visibleCount).map((order) => {
              const { _id, items, total, status, createdAt, address_id } = order;

              return (
                <div key={_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Desktop Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 p-6">
                    {/* Item Info */}
                    <div className="col-span-4 flex gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-2 flex-shrink-0">
                         <img src={items[0]?.product?.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{items[0]?.product?.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">Order ID: #{_id.slice(-8).toUpperCase()}</p>
                        <p className="text-[11px] text-gray-500">Date: {new Date(createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 flex items-center">
                       <span className="text-base font-bold text-gray-900">₹{total?.toLocaleString()}</span>
                    </div>

                    {/* Status Stepper */}
                    <div className="col-span-6 flex flex-col justify-center border-l border-gray-50 pl-6">
                       <OrderTracking status={status} />
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden p-4 space-y-4">
                    <div className="flex gap-3">
                       <div className="w-16 h-16 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-2 flex-shrink-0">
                         <img src={items[0]?.product?.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-xs font-bold text-gray-800 line-clamp-2">{items[0]?.product?.name}</h4>
                          <p className="text-[10px] text-gray-500 mt-1">ID: #{_id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">₹{total?.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="pt-2 border-t border-gray-50">
                       <OrderTracking status={status} />
                    </div>
                  </div>

                  {/* Order Footer - Address & Details Link */}
                  <div className="bg-gray-50/50 px-6 py-3 flex justify-between items-center text-[11px] border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                       <MapPin size={12} />
                       <span>Delivering to: <span className="font-bold text-gray-700">{address_id?.name || "Customer"}</span></span>
                    </div>
                    <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                      View Details <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Loader for IntersectionObserver */}
            {visibleCount < orders.length && (
              <div ref={loaderRef} className="py-8 flex justify-center">
                <div className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  Loading more orders...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
