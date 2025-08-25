import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/Cart-context";

const API_URL = "http://localhost:3000/api/products";

export const BestSeller = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  // ✅ Fetch only bestseller products
  const fetchBestsellers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      // ✅ Filter only bestseller products
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-600">
        Bestseller Products
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {bestsellers.length === 0 && !loading && (
        <p className="text-gray-500 text-center">No bestseller products yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-6">
        {bestsellers.map((product) => (
          <div
            key={product._id}
            className="bg-amber-200 rounded shadow p-4 relative"
          >
            <img
              src={product.image}
              alt={product.name}
              className="bg-amber-200 w-full max-h-min object-cover rounded mb-4"
            />
            <div className="text-center">
              <h3 className="font-semibold text-lg ">{product.name}</h3>
              <p className="text-gray-700 mt-2">₹{product.price}</p>
            </div>
            <p className="text-sm text-gray-500 capitalize">
              {product.category} → {product.subcategory}
            </p>
            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Bestseller
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
