import React, { useEffect, useState } from 'react';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const raw = localStorage.getItem('userInfo');
        console.debug('localStorage.userInfo raw ->', raw);
        let userInfo = null;
        try {
          userInfo = raw ? JSON.parse(raw) : null;
        } catch (e) {
          // if parsing fails, keep raw string
          userInfo = raw;
       }
        const token =
          (userInfo && typeof userInfo === 'object' && (
            userInfo.token ||
            userInfo.accessToken ||
            userInfo.authToken ||
            userInfo.access_token ||
            (userInfo.data && (userInfo.data.token || userInfo.data.accessToken)) ||
            (userInfo.user && userInfo.user.token)
          )) ||
          (typeof userInfo === 'string' ? userInfo : null);

        // If token exists, call with Authorization. Otherwise, try cookie-based fetch (credentials: 'include').
        let response;
        if (token) {
          response = await fetch('http://localhost:3000/api/orders', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // no token — try cookie/session based fetch (server must have set cookie on login)
          console.debug('No token found — trying cookie-based fetch with credentials:include');
          response = await fetch('http://localhost:3000/api/orders', {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
        }

        if (!response.ok) {
          const errText = await response.text().catch(() => null);
          throw new Error(errText || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
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
      <div className="text-center text-red-500 mt-10">
        Error: {error}
      </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          // adapt to Mongo order fields (._id, created_at)
          const orderId = order._id || order.id;
          const date = order.created_at || order.date || order.createdAt;
          const items = Array.isArray(order.items) ? order.items : [];
          const status = order.status || 'Pending';
          const total = typeof order.total === 'number' ? order.total : null;

          return (
            <div key={orderId} className="border rounded-lg p-6 shadow-sm bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <p className="font-medium text-lg">Order #{String(orderId).slice(-8)}</p>
                  <p className="text-gray-500 text-sm">
                    Placed on: {date ? new Date(date).toLocaleDateString() : '—'}
                  </p>
                  {total !== null && (
                    <p className="text-gray-700 text-sm mt-1">Total: ₹{Number(total).toFixed(2)}</p>
                  )}
                  {/* Payment info */}
                  {order.payment_method && (
                    <p className="text-gray-600 text-sm mt-1">
                      Payment: {order.payment_method} {order.payment_id && `• TXN ${order.payment_id}`}
                    </p>
                  )}
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : status === 'Shipped'
                        ? 'bg-yellow-100 text-yellow-800'
                        : status === 'Paid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-600">
                  <thead>
                    <tr>
                      <th className="py-2 px-3 border-b border-gray-200">Product</th>
                      <th className="py-2 px-3 border-b border-gray-200">Quantity</th>
                      <th className="py-2 px-3 border-b border-gray-200">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-4 px-3 text-gray-500">
                          No items found for this order.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => {
                        // item shape might be { product_id, name, price, quantity, image }
                        const name = item.name || item.title || 'Product';
                        const qty = item.quantity || item.qty || 1;
                        // price stored in rupees on backend
                        const price = (typeof item.price === 'number') ? Number(item.price) : Number(item.total || 0);
                        return (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-2 px-3">{name}</td>
                            <td className="py-2 px-3">{qty}</td>
                            <td className="py-2 px-3">₹{price.toFixed(2)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};