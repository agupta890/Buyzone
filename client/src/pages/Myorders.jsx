import React, { useEffect, useState } from 'react';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
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
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-6 shadow-sm bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <p className="font-medium text-lg">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">
                  Placed on: {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Shipped'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {order.status}
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
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2 px-3">{item.name}</td>
                      <td className="py-2 px-3">{item.quantity}</td>
                      <td className="py-2 px-3">${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
