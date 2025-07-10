import React, { useState, useEffect } from 'react';

const categories = [
  { id: 'upperwear', label: 'Upper Wear' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'lowerwear', label: 'Lower Wear' },
  { id: 'accessories', label: 'Accessories' },
];

export const Men = () => {
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:flex md:space-x-8">
      {/* Sidebar */}
      <aside
        className="md:w-64 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:bg-white md:p-6 md:rounded-lg md:shadow"
        aria-label="Categories"
      >
        {/* Small screen: vertical pill buttons */}
        <div className="flex flex-col space-y-3 mb-6 md:hidden overflow-x-hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
              className={`px-6 py-2 rounded-full border text-center text-sm font-medium transition
                ${
                  selectedCategory === cat.id
                    ? 'bg-yellow-500 text-white border-yellow-500 font-semibold'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-100'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Medium+ screen: vertical sidebar */}
        <ul className="hidden md:block space-y-3 border p-4 rounded-lg shadow-md bg-white">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
                className={`w-full text-left px-4 py-3 rounded transition text-lg font-medium
                  ${
                    selectedCategory === cat.id
                      ? 'bg-yellow-500 text-white font-semibold'
                      : 'hover:bg-yellow-100 text-gray-700'
                  }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Products */}
      <section className="flex-1">
        <h2 className="text-3xl font-semibold mb-6 capitalize">
          {categories.find(c => c.id === selectedCategory)?.label}
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
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-fit max-h-min p-2 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-yellow-600 font-semibold mt-2">₹{product.price}</p>
                  <button className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded transition text-sm">
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
