import React, { useContext } from "react";
import { CartContext } from "../context/Cart-context";

export const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, getTotal } =
    useContext(CartContext);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section - Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Your Cart
          </h1>

          {cart.length === 0 ? (
            <p className="text-gray-600 text-center py-16 text-lg">
              🛒 Your cart is empty
            </p>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b pb-6 last:border-0"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full sm:w-1/2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex flex-col">
                      <h2 className="font-semibold text-gray-800 text-lg truncate w-40 sm:w-auto">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 text-sm">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Quantity + Price */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-1/2 gap-6">
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        onClick={() => decreaseQty(item._id)}
                      >
                        −
                      </button>
                      <span className="font-medium min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
                        onClick={() => increaseQty(item._id)}
                      >
                        +
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="text-right min-w-[90px]">
                      <p className="font-semibold text-gray-800">
                        ₹{item.price * item.quantity}
                      </p>
                      <button
                        className="text-sm text-red-500 hover:text-red-700 mt-1"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Summary */}
        {cart.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit lg:sticky lg:top-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-gray-700 text-sm sm:text-base"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              <hr className="my-4" />

              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span className="text-green-600">₹{getTotal()}</span>
              </div>
            </div>

            <button className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition">
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
