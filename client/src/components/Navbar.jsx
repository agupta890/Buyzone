import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { categories } from "../data/categories";
import { 
  LogIn, 
  UserPlus, 
  LogOut, 
  Home, 
  Book, 
  Paintbrush, 
  Flower, 
  Sprout, 
  Baby, 
  Sparkles, 
  Nut,
  Zap,
  ShoppingBag,
  Menu,
  X,
  Search,
  ShoppingCart,
  User
} from "lucide-react"; // icons

const iconMap = {
  Home,
  Book,
  Paintbrush,
  Flower,
  Sprout,
  Baby,
  Sparkles,
  Nut
};

export const Navbar = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { auth, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
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
            className="text-xl lg:text-2xl sm:text-xl font-extrabold tracking-wide text-gray-900"
          >
            Buy<span className="text-yellow-500">Zone</span>
          </NavLink>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <NavLink
                to="/orders"
                className="text-sm font-medium text-gray-700 hover:text-yellow-500 transition-colors"
              >
                Orders
              </NavLink>
            )}

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative flex items-center text-gray-700 hover:text-yellow-500 transition-colors"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 mx-1" />

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Profile Link */}
                <NavLink 
                  to="/profile" 
                  className="flex items-center space-x-2 group hover:opacity-80 transition-opacity"
                >
                  <video
                    src="https://cdn-icons-mp4.flaticon.com/512/8121/8121295.mp4"
                    alt="profile"
                    autoPlay
                    loop
                    muted
                    className="w-8 h-8 rounded-full border-yellow-500 border-2 shadow-sm"
                  />
                  <span className="text-sm font-bold text-gray-800">
                    {user.name}
                  </span>
                </NavLink>

                {/* Redesigned Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full transition-all duration-300 shadow-sm active:scale-95"
                >
                  Logout
                </button>
                </div>
                ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-yellow-600 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-6 py-2 text-sm font-bold text-white bg-yellow-500 rounded-full hover:bg-yellow-600 shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  Signup
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          
<div className="md:hidden flex items-center space-x-3">
  {/* Cart */}
  <button onClick={handleCartClick} className="relative text-gray-700">
    <ShoppingCart size={20} />
    {cart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
        {cart.length}
      </span>
    )}
  </button>

  {/* User Avatar */}
  {user && (
    <NavLink to="/profile">
      <video
        src="https://cdn-icons-mp4.flaticon.com/512/8121/8121295.mp4"
        alt="profile"
        autoPlay
        loop
        muted
        className="w-7 h-7 rounded-full border-yellow-500 border-2"
      />
    </NavLink>
  )}

  {/* Mobile Menu Toggle */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="focus:outline-none text-gray-700"
    aria-label="Toggle menu"
  >
    {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
        {Object.entries(categories).map(([key, value]) => {
          const Icon = iconMap[value.icon];
          return (
            <NavLink
              key={key}
              to={`/category/${key}`}
              className="capitalize hover:text-yellow-500 flex items-center gap-1.5 transition-colors"
            >
              {Icon && <Icon size={16} className="text-gray-400 group-hover:text-yellow-500" />}
              {value.title}
            </NavLink>
          );
        })}
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-4 bg-white shadow-md border-t">
          {/* Mobile Categories */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavClick("/bestseller")}
              className="text-gray-700 hover:text-yellow-500 text-left flex items-center gap-2"
            >
              <Zap size={18} /> Best Sellers
            </button>

            <button
              onClick={() => handleNavClick("/shop-all")}
              className="text-pink-600 font-semibold text-left flex items-center gap-2"
            >
              <ShoppingBag size={18} /> Shop All
            </button>

            {Object.entries(categories).map(([key, value]) => {
              const Icon = iconMap[value.icon];
              return (
                <button
                  key={key}
                  onClick={() => handleNavClick(`/category/${key}`)}
                  className="capitalize text-gray-700 hover:text-yellow-500 text-left flex items-center gap-2"
                >
                  {Icon && <Icon size={18} />}
                  {value.title}
                </button>
              );
            })}

           
           {/* User / Auth Links */}
{user ? (
  <>
    <button
      onClick={() => handleNavClick("/orders")}
      className="flex items-center gap-2 text-gray-700 hover:text-yellow-500 w-full"
    >
      Orders
    </button>
    <button
      onClick={handleLogout}
      className="mt-4 py-2.5 px-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all w-full text-center border border-red-100 shadow-sm active:scale-95"
    >
      Logout
    </button>
  </>
) : (
  <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
    <NavLink
      to="/login"
      onClick={() => setMenuOpen(false)}
      className="w-full py-3 text-center font-bold text-gray-700 bg-gray-50 rounded-xl border border-gray-200 active:scale-95 transition-all"
    >
      Login
    </NavLink>
    <NavLink
      to="/register"
      onClick={() => setMenuOpen(false)}
      className="w-full py-3 text-center font-bold text-white bg-yellow-500 rounded-xl shadow-sm active:scale-95 transition-all"
    >
      Signup
    </NavLink>
  </div>
)}

          </div>
        </div>
      )}
    </nav>
  );
};
