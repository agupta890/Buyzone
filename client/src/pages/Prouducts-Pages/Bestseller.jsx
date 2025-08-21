import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../../context/Cart-context';

const categories = [
  { id: 'upperwear', label: 'Upper Wear' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'lowerwear', label: 'Lower Wear' },
  { id: 'accessories', label: 'Accessories' },
];

export const Bestseller = () => {
   const { addToCart } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState('upperwear');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/api/products?category=${selectedCategory}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto p-6 md:flex md:space-x-10">
      {/* Sidebar */}
      <aside className="md:w-64 md:sticky md:top-20 md:h-[calc(100vh-5rem)]">
        <div className="hidden md:block p-6 rounded-lg bg-black text-white shadow-md">
          <h2 className="font-bold text-lg mb-4">Shop by Category</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={selectedCategory === cat.id}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium transition
                    ${
                      selectedCategory === cat.id
                        ? 'bg-white text-black shadow'
                        : 'hover:bg-gray-800 hover:text-gray-200'
                    }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile pills */}
        <div className="flex md:hidden overflow-x-auto space-x-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition
                ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-400 hover:bg-gray-100'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Products */}
      <section className="flex-1">
        <h2 className="text-2xl font-bold mb-6 capitalize text-black">
          {categories.find((c) => c.id === selectedCategory)?.label}
        </h2>

        {loading && <p className="text-gray-600">Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-gray-600">No products found in this category.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col"
              >
                {/* Image Container fixed height */}
                <div className="h-56 w-full flex items-center justify-center bg-gray-50 rounded-t-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-center text-black text-lg line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-center text-gray-700 font-medium mt-2">
                    ₹{product.price}
                  </p>
                  <button className="mt-4 w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg transition text-sm font-medium" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
