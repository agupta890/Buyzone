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
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || data.image); // first image as default
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

  const images = product.images?.length ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left: Product Images */}
      <div className="flex flex-col items-center">
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name}
          className="w-full max-h-[500px] object-contain rounded-xl shadow-md border mb-6"
        />

        {/* Thumbnail Slider
        <div className="flex gap-3 overflow-x-auto w-full pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              onClick={() => setMainImage(img)}
              className={`w-20 h-20 object-cover border rounded-lg cursor-pointer hover:shadow-md transition ${
                mainImage === img ? "ring-2 ring-green-500" : ""
              }`}
            />
          ))}
        </div> */}
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col">
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold mb-3">{product.name}</h1>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg mb-5">{product.description}</p>

        {/* Price Section */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl md:text-3xl font-semibold text-green-600">
            ₹{product.price}
          </span>
          <span className="text-gray-400 line-through">₹{product.price + 500}</span>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <p className="font-medium mb-2">Size:</p>
          <div className="flex gap-3 flex-wrap">
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
          className="bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold shadow hover:bg-green-700 transition mb-4"
        >
          + Add to Cart
        </button>

        {/* Buy Now Button */}
        <button className="border border-gray-400 px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-medium hover:bg-gray-100 transition">
          Buy this item
        </button>
      </div>
    </div>
  );
};
