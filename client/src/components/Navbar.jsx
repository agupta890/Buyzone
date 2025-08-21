import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";

export const Navbar = () => {
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="w-full bg-white shadow">
      {/* Top row: Logo + Right actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold whitespace-nowrap">
            Buy<span className="text-pink-500">Zone</span>
          </NavLink>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile icon + name */}
                <div className="flex items-center space-x-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="profile"
                    className="w-8 h-8 rounded-full border"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name}
                  </span>
                </div>

                <NavLink to="/orders" className="text-sm hover:text-yellow-500">
                  My Orders
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-sm hover:text-yellow-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm font-bold text-pink-600 hover:text-pink-700"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="text-sm font-bold text-pink-600 hover:text-pink-700"
                >
                  Signup
                </NavLink>
              </>
            )}

            {/* Cart */}
            <NavLink to="/cart" className="hover:text-yellow-500 relative">
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
    <span className="absolute -top-4 -right-4 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
      {cart.length}
    </span>
  )}
</NavLink>

          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden focus:outline-none flex gap-6"
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
            <button
  onClick={() => handleNavClick("/cart")}
  className="relative flex items-center font-bold text-pink-600 hover:text-pink-700"
>
  {/* Cart Icon */}
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

  {/* Cart Count Badge */}
  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
      {cart.length}
    </span>
  )}
</button>

          </button>
          
        </div>
        
      </div>

      {/* Categories (desktop only) */}
      <div className="hidden md:flex justify-center flex-wrap gap-6 bg-pink-200 py-2 border-t">
        <NavLink
          to="/bestseller"
          className="text-sm font-bold hover:text-red-500"
        >
          Best Sellers
        </NavLink>
        <NavLink
          to="/homedecor"
          className="text-sm font-bold hover:text-red-500"
        >
          Home Decor
        </NavLink>
        <NavLink to="/books" className="text-sm font-bold hover:text-red-500">
          Books
        </NavLink>
        <NavLink
          to="/handicraft"
          className="text-sm font-bold hover:text-red-500"
        >
          Handicraft
        </NavLink>
        <NavLink to="/pooja" className="text-sm font-bold hover:text-red-500">
          Pooja
        </NavLink>
        <NavLink to="/plants" className="text-sm font-bold hover:text-red-500">
          Plants
        </NavLink>
        <NavLink
          to="/cosmetic"
          className="text-sm font-bold hover:text-red-500"
        >
          Cosmetic
        </NavLink>
        <NavLink
          to="/dryfruits"
          className="text-sm font-bold hover:text-red-500"
        >
          Dry Fruits
        </NavLink>
        <NavLink to="/toys" className="text-sm font-bold hover:text-red-500">
          Toys
        </NavLink>
        <NavLink to="/shop-all" className="text-sm font-bold text-pink-600">
          Shop All
        </NavLink>
      </div>



      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md border-t">
          {/* Categories */}
          <button
            onClick={() => handleNavClick("/men")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Best Sellers
          </button>
          <button
            onClick={() => handleNavClick("/women")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Home Decor
          </button>
          <button
            onClick={() => handleNavClick("/kids")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Books
          </button>
          <button
            onClick={() => handleNavClick("/funny")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Handicraft
          </button>
          <button
            onClick={() => handleNavClick("/sports")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Pooja
          </button>
          <button
            onClick={() => handleNavClick("/digital")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Plants
          </button>
          <button
            onClick={() => handleNavClick("/animals")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Cosmetic
          </button>
          <button
            onClick={() => handleNavClick("/popculture")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Dry Fruits
          </button>
          <button
            onClick={() => handleNavClick("/music")}
            className="block text-left w-full hover:text-yellow-500"
          >
            Toys
          </button>
          <button
            onClick={() => handleNavClick("/shop-all")}
            className="block text-left w-full text-pink-600"
          >
            Shop All
          </button>

          {/* Auth (mobile) */}
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
                  className="block text-left w-full hover:text-yellow-500"
                >
                  My Orders
                </button>
                
                
                <button
                  onClick={handleLogout}
                  className="block text-left w-full hover:text-yellow-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick("/login")}
                  className="block text-left w-full font-bold text-pink-600 hover:text-pink-700"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="block text-left w-full font-bold text-pink-600 hover:text-pink-700"
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
