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

  if (loading) return <p className="p-6 text-lg">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!product) return <p className="p-6">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Product Images */}
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-xl shadow-md border mb-6"
        />
        {/* Thumbnails (if you have multiple images later) */}
        <div className="flex gap-4">
          <img
            src={product.image}
            alt="thumb"
            className="w-20 h-20 border rounded-lg cursor-pointer hover:shadow"
          />
          <img
            src={product.image}
            alt="thumb"
            className="w-20 h-20 border rounded-lg cursor-pointer hover:shadow"
          />
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-3">{product.name}</h1>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-5">{product.description}</p>

        {/* Price Section */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-semibold text-green-600">
            ₹{product.price}
          </span>
          <span className="text-gray-400 line-through">₹{product.price + 500}</span>
        </div>

        {/* Sizes (Static Example) */}
        <div className="mb-6">
          <p className="font-medium mb-2">Size:</p>
          <div className="flex gap-3">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                className="border rounded-lg px-4 py-2 hover:border-black"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition mb-4"
        >
          + Add to Cart
        </button>

        {/* Buy Now Button */}
        <button className="border border-gray-400 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition">
          Buy this item
        </button>
      </div>
    </div>
  );
};
