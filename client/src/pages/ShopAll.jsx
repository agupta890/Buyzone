import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cart-context";

const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();

        // ✅ If API returns { products: [...] }
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected API format:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center py-10">Loading products...</p>;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-10">
        Shop All Products
      </h1>

      {products.length === 0 ? (
        <p className=" text-center text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="bg-neutral-200 p-1   rounded-lg shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
            >
               <div className="w-full h-48 rounded-t-lg flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
              <div className=" px-2 mt-2 rounded-lg bg-gray-200 ">
                <h3 className="text-lg font-medium text-yellow-600 truncate">
                  {product.name}
                </h3>
                <p className="text-green-600 font-semibold mt-2">
                  ₹{product.price}
                </p>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopAll;
