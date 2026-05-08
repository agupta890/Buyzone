import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load cart for current user
  const loadCart = useCallback(async (silent = false) => {
    if (!auth?.user?._id) {
      setCart([]);
      return;
    }
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cart/${auth.user._id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      const validItems = (data.items || []).filter((item) => item.product !== null);
      setCart(validItems);
    } catch (err) {
      console.error("Error loading cart:", err);
      if (!silent) setCart([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product) => {
    if (!auth?.user?._id) return navigate("/login");
    try {
      const res = await fetch(`${API_URL}/api/cart/${auth.user._id}/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      await loadCart(true); // silent update
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart");
    }
  };

  const removeFromCart = async (id) => {
    if (!auth?.user?._id) return;
    
    // Optimistic Update
    const previousCart = [...cart];
    setCart(cart.filter(item => item.product._id !== id));
    
    try {
      const res = await fetch(`${API_URL}/api/cart/${auth.user._id}/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
      toast.info("Item removed from cart");
    } catch (err) {
      console.error(err);
      setCart(previousCart); // Rollback
      toast.error("Failed to remove item");
    }
  };

  const updateQtyOptimistically = async (id, newQty) => {
    if (!auth?.user?._id) return;
    
    const previousCart = [...cart];
    setCart(cart.map(item => 
      item.product._id === id ? { ...item, quantity: newQty } : item
    ));

    try {
      const res = await fetch(`${API_URL}/api/cart/${auth.user._id}/update/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
    } catch (err) {
      console.error(err);
      setCart(previousCart); // Rollback
      toast.error("Failed to update quantity");
    }
  };

  const increaseQty = (id) => {
    const item = cart.find((i) => i.product._id === id);
    if (!item) return;
    updateQtyOptimistically(id, item.quantity + 1);
  };

  const decreaseQty = (id) => {
    const item = cart.find((i) => i.product._id === id);
    if (!item || item.quantity <= 1) return;
    updateQtyOptimistically(id, item.quantity - 1);
  };

  const getTotal = useCallback(() =>
    cart.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0), [cart]);

  const clearCart = async () => {
    setCart([]);
    if (!auth?.user?._id) return;
    try {
      await fetch(`${API_URL}/api/cart/${auth.user._id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const goToCart = () => {
    if (!auth?.user?._id) navigate("/login");
    else navigate("/cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
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
