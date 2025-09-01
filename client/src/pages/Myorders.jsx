import React, { useEffect, useState } from "react";

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders", {
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

  if (loading) return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  if (orders.length === 0) return <div className="text-center text-gray-600 mt-10">You have no previous orders.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#384959]">My Orders</h1>
      <div className="space-y-6">
        {orders.map(order => { 
          const { _id, items, total, status, payment_method, payment_id, createdAt } = order;

          return (
            <div key={_id} className="border border-green-500 rounded-xl shadow-sm bg-white hover:shadow-md transition p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-4">
                <div>
                  <p className="text-gray-700 font-semibold">Order ID: <span className="text-[#384959]">{_id}</span></p>
                  <p className="text-sm text-gray-500">Placed on: {createdAt ? new Date(createdAt).toLocaleDateString() : "—"}</p>
                  <p className="mt-1 text-gray-700">Order Total: <span className="font-semibold text-[#384959]">₹{total.toFixed(2)}</span></p>
                  {payment_method && <p className="text-gray-600 text-sm mt-1">Payment: {payment_method} {payment_id && `• TXN ${payment_id}`}</p>}
                </div>

                <span className={`px-4 py-1 h-fit rounded-full text-sm font-semibold mt-3 md:mt-0 
                  ${status === "Delivered" ? "bg-green-100 text-green-700" :
                    status === "Shipped" ? "bg-yellow-100 text-yellow-700" :
                      status === "Paid" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"}`}>
                  {status}
                </span>
              </div>

              <div className="space-y-4">
                {items.map((item, idx) => {
                  const product = item.product || {};
                  return (
                    <div key={idx} className="flex items-center gap-4 border border-green-500 rounded-lg p-3 hover:bg-gray-50">
                      <img src={product.image || "/placeholder.png"} alt={product.name || "Product"} className="w-20 h-20 object-cover rounded-lg border" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name || "Product"}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gray-700">₹{(item.price || 0).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        {status === "Delivered" ? (
                          <p className="text-green-600 text-sm font-medium">Delivered on {new Date(createdAt).toLocaleDateString()}</p>
                        ) : status === "Shipped" ? (
                          <p className="text-yellow-600 text-sm font-medium">On the way 🚚</p>
                        ) : (
                          <p className="text-gray-600 text-sm font-medium">Processing...</p>
                        )}
                        <button className="mt-2 px-4 py-1 text-sm bg-[#384959] text-white rounded-lg hover:bg-[#2d3a47]">
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
