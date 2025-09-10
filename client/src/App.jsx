import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { BestSeller } from "./pages/Prouducts-Pages/Bestseller";
import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { MyOrders } from "./pages/Myorders";
import {Admin} from './dashboard/Admin'
// import { Admin } from "./dashboard/Admin";
import CategoryPage from "./pages/Prouducts-Pages/categories";
import { ProductDetail } from "./components/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute"; // ⬅️ import it

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/search" element={<SearchPage />} /> */}

        {/* <Route path="/admin" element={<Admin />} /> */}
        <Route path="/bestseller" element={<BestSeller />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route
          path="/category/:category/:subcategory"
          element={<CategoryPage />}
        />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
