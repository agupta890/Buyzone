import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { categories } from "../data/categories";

export const Navbar = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem("userInfo");
    clearCart();
    setUser(null);
    navigate("/");
  };

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="w-full bg-white shadow-md">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-2xl font-extrabold tracking-wide text-gray-900"
          >
            Buy<span className="text-yellow-500">Zone</span>
          </NavLink>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-6">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
            <button className="px-4 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 transition">
              Search
            </button>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="profile"
                  className="w-8 h-8 rounded-full border"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-500 hover:text-yellow-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-yellow-500"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-sm font-medium text-gray-700 hover:text-yellow-500"
                >
                  Signup
                </NavLink>
              </div>
            )}

            {/* Orders */}
            {user && (
              <NavLink
                to="/orders"
                className="text-sm font-medium text-gray-700 hover:text-yellow-500"
              >
                Orders
              </NavLink>
            )}

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative flex items-center text-gray-700 hover:text-yellow-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 2.293a1 1 0 00.217 1.32l.09.077a1 1 0 001.32-.217L9 15h6l1.293 2.293a1 1 0 001.32.217l.09-.077a1 1 0 00.217-1.32L17 13M9 21h6"
                />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </NavLink>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <NavLink to="/cart" className="relative">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 2.293a1 1 0 00.217 1.32l.09.077a1 1 0 001.32-.217L9 15h6l1.293 2.293a1 1 0 001.32.217l.09-.077a1 1 0 00.217-1.32L17 13M9 21h6"
                />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="hidden md:flex justify-center flex-wrap gap-6 bg-gray-100 py-2 text-sm font-medium">
        <NavLink to="/bestseller" className="hover:text-yellow-500">
          Best Sellers
        </NavLink>
        {Object.entries(categories).map(([key, value]) => (
          <NavLink
            key={key}
            to={`/category/${key}`}
            className="capitalize hover:text-yellow-500"
          >
            {value.title}
          </NavLink>
        ))}
        <NavLink to="/shop-all" className="text-pink-600 font-semibold">
          Shop All
        </NavLink>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-2 bg-white shadow-md border-t">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-md mb-3 text-sm"
          />
          <button
            onClick={() => handleNavClick("/bestseller")}
            className="block w-full text-left hover:text-yellow-500"
          >
            Best Sellers
          </button>
          {Object.entries(categories).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleNavClick(`/category/${key}`)}
              className="block w-full text-left capitalize hover:text-yellow-500"
            >
              {value.title}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("/shop-all")}
            className="block w-full text-left text-pink-600 font-semibold"
          >
            Shop All
          </button>

          {/* Mobile Auth */}
          <div className="mt-3 border-t pt-2">
            {user ? (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="profile"
                    className="w-8 h-8 rounded-full border"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={() => handleNavClick("/orders")}
                  className="block w-full text-left hover:text-yellow-500"
                >
                  My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-yellow-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick("/login")}
                  className="block w-full text-left font-medium text-gray-700 hover:text-yellow-500"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="block w-full text-left font-medium text-gray-700 hover:text-yellow-500"
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
