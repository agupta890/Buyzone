import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('/api/products'); // Update with your backend endpoint
        const data = Array.isArray(response.data) ? response.data : [];
        setCartItems(data);
      } catch (err) {
        setError('Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const totalAmount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0)
    : 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className=" bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                  <button className="text-red-500 text-sm hover:underline mt-1">Remove</button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-xl font-bold text-yellow-600">₹{totalAmount}</span>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition shadow">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

