import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, MapPin, RotateCcw, AlertCircle } from "lucide-react";
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
  const steps = ["Ordered", "Packed", "Dispatched", "Delivered"];

  const getActiveStep = () => {
    if (status === "Cancelled") return -1;
    switch (status) {
      case "Delivered":
      case "Return_Requested":
      case "Returned":
        return 3;
      case "Dispatched": return 2;
      case "Packing": return 1;
      case "Pending":
      case "Paid":
        return 0;
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

  if (status === "Return_Requested") {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-orange-50 text-orange-600 rounded-lg border border-orange-100 text-xs font-bold mt-4">
        <RotateCcw size={16} />
        <span>Return Requested — Pending Review</span>
      </div>
    );
  }

  if (status === "Returned") {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-purple-50 text-purple-600 rounded-lg border border-purple-100 text-xs font-bold mt-4">
        <CheckCircle size={16} />
        <span>Order Returned</span>
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

const ActionModal = ({ type, onConfirm, onClose, loading, successInfo }) => {
  const [reason, setReason] = useState("");
  const isCancel = type === "cancel";

  if (successInfo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          {successInfo.type === "return" ? (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Return Request Submitted!</h3>
              <p className="text-sm text-gray-500 mb-1">Your request has been received successfully.</p>
              {successInfo.pickupDays > 0 ? (
                <p className="text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mt-3">
                  Your item will be picked up within <span className="text-lg">{successInfo.pickupDays}</span> days.
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Our team will contact you shortly.</p>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Order Cancelled</h3>
              <p className="text-sm text-gray-500">Your order has been cancelled successfully.</p>
            </>
          )}
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isCancel ? "bg-red-50" : "bg-orange-50"}`}>
          {isCancel ? <XCircle size={24} className="text-red-500" /> : <RotateCcw size={24} className="text-orange-500" />}
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
          {isCancel ? "Cancel Order?" : "Request Return?"}
        </h3>
        <p className="text-sm text-gray-500 text-center mb-5">
          {isCancel
            ? "This action cannot be undone. Your order will be cancelled."
            : "We'll review your return request and get back to you."}
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={isCancel ? "Reason for cancellation (optional)" : "Reason for return (optional)"}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-gray-200 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 ${
              isCancel ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Processing..." : isCancel ? "Yes, Cancel" : "Submit Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'cancel'|'return', orderId, pickupDays }
  const [actionLoading, setActionLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // shown inside modal after action

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < orders.length) {
          setVisibleCount((prev) => prev + 5);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [orders.length, visibleCount]);

  const handleAction = async (reason) => {
    if (!modal) return;
    setActionLoading(true);
    const endpoint = modal.type === "cancel" ? "cancel" : "return";
    try {
      const res = await fetch(`${API_URL}/api/orders/${modal.orderId}/${endpoint}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setOrders((prev) =>
        prev.map((o) => (o._id === modal.orderId ? { ...o, status: data.order.status } : o))
      );
      setSuccessInfo({ type: modal.type, pickupDays: modal.pickupDays || 0 });
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered": return "text-green-600 bg-green-50 border-green-100";
      case "Dispatched": return "text-blue-600 bg-blue-50 border-blue-100";
      case "Packing": return "text-orange-600 bg-orange-50 border-orange-100";
      case "Cancelled": return "text-red-600 bg-red-50 border-red-100";
      case "Return_Requested": return "text-orange-600 bg-orange-50 border-orange-100";
      case "Returned": return "text-purple-600 bg-purple-50 border-purple-100";
      case "Pending":
      case "Paid":
        return "text-yellow-600 bg-yellow-50 border-yellow-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getStatusLabel = (status) => {
    if (status === "Return_Requested") return "Return Requested";
    return status;
  };

  const canCancel = (status) => ["Pending", "Paid", "Packing"].includes(status);
  // returnDays=0 means no returns; undefined (old products) defaults to 7-day returns
  const canReturn = (status, items) =>
    status === "Delivered" && (items[0]?.product?.returnDays ?? 7) > 0;

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
      {modal && (
        <ActionModal
          type={modal.type}
          loading={actionLoading}
          onConfirm={handleAction}
          successInfo={successInfo}
          onClose={() => { setModal(null); setSuccessInfo(null); }}
        />
      )}

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
                    <div className="col-span-4 flex gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-2 flex-shrink-0">
                        <img src={items[0]?.product?.image} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{items[0]?.product?.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">Order ID: #{_id.slice(-8).toUpperCase()}</p>
                        <p className="text-[11px] text-gray-500">Date: {new Date(createdAt).toLocaleDateString()}</p>
                        <span className={`mt-2 inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${getStatusStyles(status)}`}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <span className="text-base font-bold text-gray-900">₹{total?.toLocaleString()}</span>
                    </div>

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
                        <span className={`mt-1 inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyles(status)}`}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-50">
                      <OrderTracking status={status} />
                    </div>
                  </div>

                  {/* Order Footer — address + action buttons + view details */}
                  <div className="bg-gray-50/50 px-6 py-3 flex justify-between items-center text-[11px] border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={12} />
                      <span>Delivering to: <span className="font-bold text-gray-700">{address_id?.name || "Customer"}</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      {canCancel(status) && (
                        <button
                          onClick={() => setModal({ type: "cancel", orderId: _id })}
                          className="font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                      {canReturn(status, items) && (
                        <button
                          onClick={() => setModal({ type: "return", orderId: _id, pickupDays: items[0]?.product?.returnDays ?? 7 })}
                          className="font-bold text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <RotateCcw size={11} /> Return Order
                        </button>
                      )}
                      <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                        View Details <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

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
