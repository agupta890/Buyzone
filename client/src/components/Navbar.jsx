import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { categories } from "../data/categories";
import { LogIn, UserPlus, LogOut, Heart } from "lucide-react"; // icons

export const Navbar = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { auth, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const user = auth?.user || null;

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/login");
  };

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  // 🔹 Prevent flicker while checking auth
  if (auth.loading) {
    return (
      <nav className="w-full bg-white shadow-md">
        <div className="h-16 flex items-center justify-center text-gray-500">
          Loading...
        </div>
      </nav>
    );
  }

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

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-6">
            <form onSubmit={handleSearch} className="flex flex-1">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-l-md border  border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              />
              <button
                type="submit"
                className="px-4 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-3">
                <video
                  src="https://cdn-icons-mp4.flaticon.com/512/8121/8121295.mp4"
                  alt="profile"
                  autoPlay
                  loop
                  muted

                  className="w-8 h-8 rounded-full border-green-500 border-2"
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

            {user && (
              <NavLink
                to="/orders"
                className="text-sm font-medium text-gray-700 hover:text-yellow-500"
              >
                Orders
              </NavLink>
            )}

           {/* ✅ Add Wishlist in mobile menu */}
    {user && (
      <NavLink
        to="/wishlist"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
      >
        <Heart/>
      </NavLink>
    )}
            {/* Cart */}
            <button
              onClick={handleCartClick}
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
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            {/* ✅ Add Wishlist in mobile menu */}
            {user && (
              <NavLink
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
              >
                <Heart />
              </NavLink>
            )}
            <button onClick={handleCartClick} className="relative">
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
            </button>
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
      <div className="hidden md:flex justify-center flex-wrap gap-6 lg:gap-10 bg-gray-100 py-2 text-sm font-medium">
        <NavLink to="/shop-all" className="text-pink-600 font-semibold">
          Shop All
        </NavLink>

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
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-4 bg-white shadow-md border-t">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
            <button
              type="submit"
              className="px-3 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600"
            >
              Go
            </button>
          </form>

          {/* Mobile Categories */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavClick("/bestseller")}
              className="text-gray-700 hover:text-yellow-500 text-left"
            >
              Best Sellers
            </button>

            <button
              onClick={() => handleNavClick("/shop-all")}
              className="text-pink-600 font-semibold text-left"
            >
              Shop All
            </button>

            {Object.entries(categories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleNavClick(`/category/${key}`)}
                className="capitalize text-gray-700 hover:text-yellow-500 text-left"
              >
                {value.title}
              </button>
            ))}

            {/* User / Auth Links */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-yellow-500 w-full"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-yellow-500"
                >
                  <LogIn size={18} /> Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-yellow-500"
                >
                  <UserPlus size={18} /> Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
