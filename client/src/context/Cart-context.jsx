import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { VITE_API_URL } from "../config";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart for current user
  const loadCart = async () => {
    if (!auth?.user?._id) {
      setCart([]);
      return;
    }
    try {
      const res = await fetch(`${VITE_API_URL}/api/cart/${auth.user._id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Error loading cart:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, [auth]);

  const addToCart = async (product) => {
    if (!auth?.user?._id) return navigate("/login");
    try {
      const res = await fetch(`${VITE_API_URL}/api/cart/${auth.user._id}/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (id) => {
    if (!auth?.user?._id) return;
    try {
      const res = await fetch(`${VITE_API_URL}/api/cart/${auth.user._id}/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQty = async (id) => {
    if (!auth?.user?._id) return;
    const item = cart.find((i) => i.product._id === id);
    if (!item) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/cart/${auth.user._id}/update/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      if (!res.ok) throw new Error("Failed to increase quantity");
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQty = async (id) => {
    if (!auth?.user?._id) return;
    const item = cart.find((i) => i.product._id === id);
    if (!item || item.quantity <= 1) return;

    try {
      const res = await fetch(`${VITE_API_URL}/api/cart/${auth.user._id}/update/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      if (!res.ok) throw new Error("Failed to decrease quantity");
      await loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const getTotal = () =>
    cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  const clearCart = () => setCart([]);

  const goToCart = () => {
    if (!auth?.user?._id) navigate("/login");
    else navigate("/cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        getTotal,
        clearCart,
        loadCart,
        goToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
