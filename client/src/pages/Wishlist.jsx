import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await axios.get('/api/wishlist'); // Update with your backend endpoint
        const data = Array.isArray(response.data) ? response.data : [];
        setWishlistItems(data);
      } catch (err) {
        setError('Failed to fetch wishlist items');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className=" bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Your Wishlist</h2>

        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-600">Your wishlist is empty.</p>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition text-sm">Add to Cart</button>
                  <br />
                  <button className="text-red-500 text-sm hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


