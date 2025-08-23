import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Bestseller } from "./pages/Prouducts-Pages/Bestseller";

import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { MyOrders } from "./pages/Myorders";
import { Admin } from "./dashboard/Admin";
import CategoryPage from "./pages/Prouducts-Pages/categories";


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/bestseller" element={<Bestseller />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/category/:category/:subcategory" element={<CategoryPage />} />


        

        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
