import React, { useEffect, useState } from "react";

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const raw = localStorage.getItem("userInfo");
        let userInfo = null;
        try {
          userInfo = raw ? JSON.parse(raw) : null;
        } catch (e) {
          userInfo = raw;
        }

        const token =
          (userInfo &&
            typeof userInfo === "object" &&
            (userInfo.token ||
              userInfo.accessToken ||
              userInfo.authToken ||
              userInfo.access_token ||
              (userInfo.data &&
                (userInfo.data.token || userInfo.data.accessToken)) ||
              (userInfo.user && userInfo.user.token))) ||
          (typeof userInfo === "string" ? userInfo : null);

        let response;
        if (token) {
          response = await fetch("http://localhost:3000/api/orders", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await fetch("http://localhost:3000/api/orders", {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
        }

        if (!response.ok) {
          const errText = await response.text().catch(() => null);
          throw new Error(errText || "Failed to fetch orders");
        }

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">Error: {error}</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        You have no previous orders.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#384959]">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const orderId = order._id || order.id;
          const date = order.created_at || order.date || order.createdAt;
          const items = Array.isArray(order.items) ? order.items : [];
          const status = order.status || "Pending";
          const total = typeof order.total === "number" ? order.total : null;

          return (
            <div
              key={orderId}
              className="border rounded-xl shadow-sm bg-white hover:shadow-md transition p-6"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-4">
                <div>
                  <p className="text-gray-700 font-semibold">
                    Order ID: <span className="text-[#384959]">{orderId}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on:{" "}
                    {date ? new Date(date).toLocaleDateString() : "—"}
                  </p>
                  {total !== null && (
                    <p className="mt-1 text-gray-700">
                      Order Total:{" "}
                      <span className="font-semibold text-[#384959]">
                        ₹{Number(total).toFixed(2)}
                      </span>
                    </p>
                  )}
                  {order.payment_method && (
                    <p className="text-gray-600 text-sm mt-1">
                      Payment: {order.payment_method}{" "}
                      {order.payment_id && `• TXN ${order.payment_id}`}
                    </p>
                  )}
                </div>

                <span
                  className={`px-4 py-1 h-fit rounded-full text-sm font-semibold mt-3 md:mt-0 ${
                    status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : status === "Shipped"
                      ? "bg-yellow-100 text-yellow-700"
                      : status === "Paid"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Product Items */}
              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-gray-500">No items found for this order.</p>
                ) : (
                  items.map((item, idx) => {
                    const name = item.name || item.title || "Product";
                    const qty = item.quantity || item.qty || 1;
                    const price =
                      typeof item.price === "number"
                        ? Number(item.price)
                        : Number(item.total || 0);
                    const img = item.image || "/placeholder.png";

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 border rounded-lg p-3 hover:bg-gray-50"
                      >
                        <img
                          src={img}
                          alt={name}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{name}</p>
                          <p className="text-sm text-gray-500">Qty: {qty}</p>
                          <p className="text-sm font-semibold text-gray-700">
                            ₹{price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          {status === "Delivered" ? (
                            <p className="text-green-600 text-sm font-medium">
                              Delivered on{" "}
                              {new Date(date).toLocaleDateString()}
                            </p>
                          ) : status === "Shipped" ? (
                            <p className="text-yellow-600 text-sm font-medium">
                              On the way 🚚
                            </p>
                          ) : (
                            <p className="text-gray-600 text-sm font-medium">
                              Processing...
                            </p>
                          )}
                          <button className="mt-2 px-4 py-1 text-sm bg-[#384959] text-white rounded-lg hover:bg-[#2d3a47]">
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
