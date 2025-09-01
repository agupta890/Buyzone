import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/Cart-context";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api/products";

export const BestSeller = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  const fetchBestsellers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const best = (data.products || []).filter((p) => p.isBestsellers);
      setBestsellers(best);
    } catch (err) {
      setError("Failed to load bestsellers");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-[#384959] mb-6 flex items-center gap-3 border-b-2 border-gray-200 pb-2">
        <span className="bg-[#384959] text-white px-4 py-1 rounded-md shadow">
    Bestseller Products
  </span>
        
      </h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {bestsellers.length === 0 && !loading && (
        <p className="text-gray-500 text-center">No bestseller products yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {bestsellers.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="group"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {/* Image */}
              <div className="relative bg-gray-50 flex items-center justify-center h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-40 object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Bestseller
                </span>
              </div>

              {/* Content */}
              <div className="p-4 text-center">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </h3>
                <p className="text-base font-bold text-gray-800 mt-1">
                  ₹{product.price}
                </p>
                <p className="text-xs text-gray-500 capitalize mt-1">
                  {product.category} → {product.subcategory}
                </p>

                {/* Add to Cart */}
                <button
                  className="mt-3 w-full bg-green-900 text-white text-xs font-medium py-2 rounded-md hover:bg-green-800 transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
