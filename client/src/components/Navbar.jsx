import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo and categories section */}
          <div className="flex items-center space-x-10">
            <NavLink to="/" className="text-2xl font-bold">
              Buy<span className="text-yellow-500">Zone</span>
            </NavLink>
            <div className="hidden md:flex space-x-4">
              <NavLink to="/men" className="text-sm font-medium hover:text-yellow-500">
                MEN
              </NavLink>
              <NavLink to="/women" className="text-sm font-medium hover:text-yellow-500">
                WOMEN
              </NavLink>
              <NavLink to="/kids" className="text-sm font-medium hover:text-yellow-500">
                KIDS
              </NavLink>
            </div>
          </div>

          {/* Search bar section */}
          <div className="hidden md:block mx-2 w-48">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {/* Search icon */}
              <svg
                className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
                />
              </svg>
            </div>
          </div>

          {/* Icons and mobile menu button */}
          <div className="flex items-center space-x-3">

            {/* Cart icon - visible on small and medium+ devices */}
            <NavLink to="/cart" className="hover:text-yellow-500 cursor-pointer">
              <svg
                className="w-6 h-6 md:hidden"  // Show on small devices only here
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
            </NavLink>

            {/* Desktop icons */}
            <NavLink to="/login" className="text-sm font-medium hover:text-yellow-500 hidden md:block">
              LOGIN
            </NavLink>
            <NavLink to="/signup" className="text-sm font-medium hover:text-yellow-500 hidden md:block">
              SIGNUP
            </NavLink>

            {/* Wishlist icon - desktop only */}
            <NavLink to="/wishlist" className="hidden md:block hover:text-yellow-500 cursor-pointer">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </NavLink>

            {/* Cart icon desktop only */}
            <NavLink to="/cart" className="hidden md:block hover:text-yellow-500 cursor-pointer">
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
            </NavLink>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md">
          <button
            onClick={() => handleNavClick('/men')}
            className="block text-left w-full text-sm font-medium hover:text-yellow-500"
          >
            MEN
          </button>
          <button
            onClick={() => handleNavClick('/women')}
            className="block text-left w-full text-sm font-medium hover:text-yellow-500"
          >
            WOMEN
          </button>
          <button
            onClick={() => handleNavClick('/kids')}
            className="block text-left w-full text-sm font-medium hover:text-yellow-500"
          >
            KIDS
          </button>
          <button
            onClick={() => handleNavClick('/login')}
            className="block text-left w-full text-sm font-medium hover:text-yellow-500"
          >
            LOGIN
          </button>
          <button
            onClick={() => handleNavClick('/signup')}
            className="block text-left w-full text-sm font-medium hover:text-yellow-500"
          >
            SIGNUP
          </button>
        </div>
      )}
    </nav>
  );
};
