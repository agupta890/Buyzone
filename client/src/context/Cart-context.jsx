import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const userId = "user123"; // Replace with actual logged-in user
  const [cart, setCart] = useState([]);

  // ✅ Fetch cart directly (backend already populates products)
  const loadCart = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
      const data = await res.json();
      setCart(data.items || []); // items already have { product, quantity }
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ✅ Add product
  const addToCart = async (product) => {
    await fetch(`http://localhost:3000/api/cart/${userId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity: 1 })
    });
    await loadCart();
  };

  // ✅ Remove product
  const removeFromCart = async (id) => {
    await fetch(`http://localhost:3000/api/cart/${userId}/remove/${id}`, {
      method: "DELETE"
    });
    await loadCart();
  };

  // ✅ Increase quantity
  const increaseQty = async (id) => {
    const item = cart.find((i) => i.product._id === id);
    if (!item) return;

    await fetch(`http://localhost:3000/api/cart/${userId}/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: item.quantity + 1 })
    });
    await loadCart();
  };

  // ✅ Decrease quantity
  const decreaseQty = async (id) => {
    const item = cart.find((i) => i.product._id === id);
    if (!item || item.quantity <= 1) return;

    await fetch(`http://localhost:3000/api/cart/${userId}/update/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: item.quantity - 1 })
    });
    await loadCart();
  };

  // ✅ Calculate total
  const getTotal = () =>
    cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  //clear cart

  const clearCart = () => {
  setCart([]);
  localStorage.removeItem("cart");
};


  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, getTotal, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
