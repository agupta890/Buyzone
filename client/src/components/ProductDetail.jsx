import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import BuyButton from "./BuyButton";
import { VITE_API_URL } from "../config";

const API_URL = `${VITE_API_URL}/products`;

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logic untouched
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
      recent = recent.filter((p) => p._id !== product._id);
      recent.unshift(product);
      if (recent.length > 6) recent.pop();
      localStorage.setItem("recentlyViewed", JSON.stringify(recent));
    }
  }, [product]);

  if (loading) return <p className="p-6 text-lg text-center">Loading...</p>;
  if (error) return <p className="p-6 text-red-500 text-center">{error}</p>;
  if (!product) return <p className="p-6 text-center">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8 flex flex-col lg:flex-row gap-8 relative">
      
      {/* Left: Smaller Image */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-sm h-[300px] sm:h-[350px] bg-white rounded-3xl shadow-xl flex items-center justify-center p-4">
          <img
            src={product.image}
            alt={product.name}
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Right: Details */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          {product.name}
        </h1>

        {/* Ratings */}
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-green-600 text-white px-3 py-1 rounded-lg font-medium">
            4.3 ★
          </span>
          <span className="text-gray-600 text-sm">
            12,345 Ratings & 2,100 Reviews
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-3 mb-6">
          <span className="text-3xl sm:text-4xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-gray-500 line-through text-lg">
            ₹{product.price + 500}
          </span>
          <span className="text-green-600 font-semibold text-lg">10% off</span>
        </div>

        {/* Offers */}
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-2 text-gray-800 text-lg">
            Available Offers
          </h3>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
            <li>Bank Offer: 10% off on ICICI Credit Cards</li>
            <li>Special Price: Get extra 5% off (price inclusive of discount)</li>
            <li>Combo Offer: Buy 2 or more, save extra 10%</li>
          </ul>
        </div>

        {/* Description */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-24 lg:mb-0">
          <h3 className="font-semibold mb-2 text-gray-800 text-lg">
            Product Description
          </h3>
          <p className="text-gray-600 text-base leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Buttons: Sticky on mobile, inline on desktop */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-t flex gap-4 z-50">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-2xl transition"
          >
            ADD TO CART
          </button>
          <BuyButton product={product}/>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex gap-4 mt-6">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-2xl transition"
          >
            ADD TO CART
          </button>
          <BuyButton product={product}/>
        </div>
      </div>
    </div>
  );
};
