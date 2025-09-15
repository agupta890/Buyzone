import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cart-context";

const API_URL = "http://localhost:3000/api/products";

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);


  useEffect(() => {
  if (product) {
    let recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    // remove if already exists
    recent = recent.filter((p) => p._id !== product._id);

    // add latest product on top
    recent.unshift(product);

    // keep only last 6 items
    if (recent.length > 6) recent.pop();

    localStorage.setItem("recentlyViewed", JSON.stringify(recent));
  }
}, [product]);


  if (loading) return <p className="p-6 text-lg">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!product) return <p className="p-6">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Product Images */}
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-center bg-white border rounded-md p-4 shadow-sm">
  <div className="w-[350px] h-[450px]  flex items-center justify-center">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-contain rounded-md"
    />
  </div>
</div>


        {/* Action Buttons (Sticky on Desktop like Flipkart) */}
        <div className="flex gap-4 mt-6 w-full justify-center">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-orange-500 text-white text-lg font-semibold py-3 rounded-md hover:bg-orange-600 transition"
          >
            ADD TO CART
          </button>
          <button className="flex-1 bg-green-600 text-white text-lg font-semibold py-3 rounded-md hover:bg-green-700 transition">
            BUY NOW
          </button>
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col">
        {/* Title */}
        <h1 className="text-2xl lg:text-3xl font-semibold mb-2 text-gray-900">
          {product.name}
        </h1>

        {/* Ratings + Small Info */}
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-medium">
            4.3 ★
          </span>
          <span className="text-gray-600 text-sm">12,345 Ratings & 2,100 Reviews</span>
        </div>

        {/* Price Section */}
        <div className="flex items-end gap-3 mb-4">
          <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
          <span className="text-gray-500 line-through text-lg">
            ₹{product.price + 500}
          </span>
          <span className="text-green-600 font-semibold text-lg">10% off</span>
        </div>

        {/* Offers */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Available offers</h3>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Bank Offer: 10% off on ICICI Credit Cards</li>
            <li>Special Price: Get extra 5% off (price inclusive of discount)</li>
            <li>Combo Offer: Buy 2 or more, save extra 10%</li>
          </ul>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Product Description</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};
