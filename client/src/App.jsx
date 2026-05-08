import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Lazy load page components
const HomePage = lazy(() => import("./pages/HomePage").then(module => ({ default: module.HomePage })));
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("./pages/Register").then(module => ({ default: module.Register })));
const BestSeller = lazy(() => import("./pages/Prouducts-Pages/Bestseller").then(module => ({ default: module.BestSeller })));
const Cart = lazy(() => import("./pages/Cart").then(module => ({ default: module.Cart })));
const MyOrders = lazy(() => import("./pages/Myorders").then(module => ({ default: module.MyOrders })));
const Admin = lazy(() => import("./dashboard/Admin").then(module => ({ default: module.Admin })));
const CategoryPage = lazy(() => import("./pages/Prouducts-Pages/categories"));
const ProductDetail = lazy(() => import("./components/ProductDetail").then(module => ({ default: module.ProductDetail })));
const AddressPage = lazy(() => import("./pages/AddressPage").then(module => ({ default: module.AddressPage })));
const ShopAll = lazy(() => import("./pages/ShopAll"));
const Profile = lazy(() => import("./components/profile/Profile"));

import ProtectedRoute from "./components/ProtectedRoute";

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
  </div>
);

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="/bestseller" element={<BestSeller />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/category/:category/:subcategory"
            element={<CategoryPage />}
          />
          <Route path="/shop-all" element={<ShopAll />} />
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
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <AddressPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};
export default App;
