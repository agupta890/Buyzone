import { useContext, useState } from "react";
import { CartContext } from "../context/Cart-context";
import { AddressPage } from "./AddressPage"; //
import { useNavigate } from "react-router-dom";
import RecentlyViewed from "./RecentlyViewed";

export const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, getTotal } =
    useContext(CartContext);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Cart Items */}
        <div className="lg:col-span-2 space-y-10">
          {/* Cart Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
              Your Cart
            </h1>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-8">
                <video
                  src="https://cdn-icons-mp4.flaticon.com/512/15547/15547248.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-48 h-48 mb-4"
                ></video>
                <p className="text-gray-600 text-lg">Your cart is empty</p>
                <button
                  onClick={() => navigate("/shop-all")}
                  className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-400 transition"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <div className="space-y-6">
  {cart.map((item) => (
    <div
      key={item.product._id}
      className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b pb-6 last:border-0"
    >
      {/* Product Info */}
      <div className="flex items-center gap-4 w-full sm:w-1/2">
        <img
          src={item.product.image}
          alt={item.product.name}
  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg bg-gray-100 shadow-md"
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-800 text-base sm:text-lg line-clamp-2">
            {item.product.name}
          </h2>
          <p className="text-gray-600 text-sm">₹{item.product.price}</p>
        </div>
      </div>

      {/* Quantity + Price */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-1/2 gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
            onClick={() => decreaseQty(item.product._id)}
          >
            −
          </button>
          <span className="font-medium min-w-[20px] text-center">
            {item.quantity}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
            onClick={() => increaseQty(item.product._id)}
          >
            +
          </button>
        </div>

        {/* Price + Remove */}
        <div className="text-right min-w-[90px]">
          <p className="font-semibold text-gray-800">
            ₹{item.product.price * item.quantity}
          </p>
          <button
            className="text-sm text-red-500 hover:text-red-700 mt-1"
            onClick={() => removeFromCart(item.product._id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ))}

  {/* Shop More Button */}
  <div className="text-center">
    <button
      onClick={() => navigate("/shop-all")}
      className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition"
    >
      Shop More
    </button>
  </div>
</div>

            )}
          </div>
{/* Recently Viewed Items */}
<div className="mt-2">
  <RecentlyViewed/>
</div>



          {/* ✅ Address Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <AddressPage onSelectAddress={setSelectedAddressId} />
          </div>
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
                  key={item.product._id}
                  className="flex justify-between text-gray-700 text-sm sm:text-base"
                >
                  <span className="font-medium text-gray-800 text-sm sm:text-lg line-clamp-3">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}

              <hr className="my-4" />

              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span className="text-green-600">₹{getTotal()}</span>
              </div>
            </div>

            {/* Checkout button (Razorpay etc) can go here */}
            {/* 🚀 Razorpay Logic - untouched */}
            <button
              onClick={async () => {
                if (!selectedAddressId) {
                  alert("⚠️ Please select an address before checkout");
                  return;
                }

                if (!window.Razorpay) {
                  await new Promise((resolve, reject) => {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                  }).catch(() => alert("Failed to load Razorpay SDK"));
                }

                try {
                  const amount = getTotal();
                  const res = await fetch(
                    "http://localhost:3000/api/payments/create-order",
                    {
                      method: "POST",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ amount }),
                    }
                  );
                  const data = await res.json();
                  if (!res.ok)
                    throw new Error(data.error || "Order creation failed");

                  const { order, key_id } = data;
                  const options = {
                    key: key_id,
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.id,
                    handler: async function (response) {
                      const verifyRes = await fetch(
                        "http://localhost:3000/api/payments/verify",
                        {
                          method: "POST",
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            address_id: selectedAddressId,
                            cart,
                            total: amount,
                          }),
                        }
                      );
                      const verifyData = await verifyRes.json();
                      if (verifyRes.ok && verifyData.verified) {
                        alert("Payment successful! Order placed.");
                        window.location.href = "/orders";
                      } else {
                        alert(
                          "Payment could not be verified: " +
                            (verifyData.error || "Unknown error")
                        );
                      }
                    },
                    modal: {
                      ondismiss: function () {
                        alert("Payment cancelled");
                      },
                    },
                  };

                  const rzp = new window.Razorpay(options);
                  rzp.on("payment.failed", function (resp) {
                    console.error("Payment failed", resp);
                    alert("Payment failed or was cancelled.");
                  });
                  rzp.open();
                } catch (err) {
                  console.error(err);
                  alert(err.message || "Checkout failed");
                }
              }}
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
