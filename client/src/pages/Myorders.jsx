import React, { useEffect, useState } from "react";
import { VITE_API_URL } from "../config";

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${VITE_API_URL}/orders`, {
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading orders...
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (orders.length === 0)
    return (
      <div className="text-center text-gray-600 mt-10">
        You have no previous orders.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#384959]">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const {
            _id,
            items,
            total,
            status,
            payment_method,
            payment_id,
            createdAt,
            updatedAt,
            address_id,
          } = order;

          return (
            <div
              key={_id}
              className="border border-green-500 rounded-xl shadow-sm bg-white hover:shadow-md transition p-4 sm:p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between gap-3 mb-6 border-b pb-4">
                <div className="text-sm sm:text-base">
                  <p className="text-gray-700 font-semibold break-all">
                    Order ID: <span className="text-[#384959]">{_id}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Placed on:{" "}
                    {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
                  </p>
                  <p className="mt-1 text-gray-700">
                    Order Total:{" "}
                    <span className="font-semibold text-[#384959]">
                      ₹{total.toFixed(2)}
                    </span>
                  </p>

                  {payment_method && (
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Payment: {payment_method}{" "}
                      {payment_id && `• TXN ${payment_id}`}
                    </p>
                  )}

                  

                  {/* ✅ Delivery Address */}
                  {address_id && (
                    <div className="mt-3 text-xs sm:text-sm text-gray-700">
                      <p className="font-semibold">Delivery Address:</p>
                      <p>{address_id.name}</p>
                      <p>{address_id.phone}</p>
                      <p>
                        {address_id.house_no}{" "}
                        {address_id.building ? address_id.building : ""}{" "}
                        {address_id.street}, {address_id.city}
                      </p>
                      <p>
                        {address_id.state} - {address_id.pincode}
                      </p>
                      {address_id.nearest && <p>{address_id.nearest}</p>}
                    </div>
                  )}
                </div>

                {/* ✅ Status Badge */}
                <span
                  className={`px-3 sm:px-4 py-1 h-fit rounded-full text-xs sm:text-sm font-semibold 
                    ${
                      status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : status === "Shipped"
                        ? "bg-yellow-100 text-yellow-700"
                        : status === "Paid"
                        ? "bg-blue-100 text-blue-700"
                        : status === "Processing"
                        ? "bg-purple-100 text-purple-700"
                        : status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {status}
                </span>
              </div>

              {/* ✅ Order Items */}
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const product = item.product || {};
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 border border-green-500 rounded-lg p-3 hover:bg-gray-50"
                    >
                      {/* Product Image */}
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name || "Product"}
                        className="bg-gray-300 p-1 w-32 h-42 object-contain rounded-lg "
                      />

                      {/* Product Info */}
                      <div className="flex-1 text-sm sm:text-base">
                        <p className="font-medium text-gray-800 overflow-hidden">
                          {product.name || "Product"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          ₹{(item.price || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Status & Extra Info */}
                      <div className="text-left sm:text-right">
                        {status === "Delivered" ? (
                          <p className="text-green-600 text-xs sm:text-sm font-medium">
                            Delivered on:{" "}
                            {new Date(updatedAt || createdAt).toLocaleDateString()}
                          </p>
                        ) : status === "Shipped" ? (
                          <div className="flex items-center gap-2 text-yellow-600 text-xs sm:text-sm font-medium">
                            <video
                              src="https://cdn-icons-mp4.flaticon.com/512/15576/15576130.mp4"
                              className="w-6 h-6 sm:w-8 sm:h-8"
                              autoPlay
                              loop
                              muted
                            />
                            On the way
                          </div>
                        ) : (
                          <p className="text-gray-600 text-xs sm:text-sm font-medium">
                            Processing...
                          </p>
                        )}

                        <button className="mt-2 px-3 sm:px-4 py-1 text-xs sm:text-sm bg-[#384959] text-white rounded-lg hover:bg-[#2d3a47]">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
