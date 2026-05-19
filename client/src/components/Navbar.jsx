import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { useCategories } from "../context/CategoriesContext";
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
  User,
  ArrowLeft,
  ChevronDown,
  Package,
  LayoutGrid
} from "lucide-react";

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
  const { categories } = useCategories();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQuery("");
    setMenuOpen(false);
    navigate(`/shop-all?q=${encodeURIComponent(q)}`);
  };

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
    navigate(user ? "/cart" : "/login");
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

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
    <>
      <nav className="w-full bg-white shadow-md">
        {/* Top Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Back Button */}
            <div className="flex items-center gap-3">
              {location.pathname !== "/" && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 active:scale-90"
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <NavLink
                to="/"
                className="text-xl lg:text-2xl font-extrabold tracking-wide text-gray-900"
              >
                Buy<span className="text-yellow-500">Zone</span>
              </NavLink>
            </div>

            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-lg mx-8">
              <div className={`flex items-center gap-2 border rounded-full px-4 py-2 transition-all duration-300 bg-gray-50 hover:bg-white w-full ${searchOpen ? "border-amber-400 bg-white shadow-sm" : "border-gray-200"}`}>
                <Search size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  placeholder="Search products..."
                  className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                />
                {searchQuery && (
                  <button type="submit" className="text-amber-500 font-bold text-xs flex-shrink-0">Go</button>
                )}
              </div>
            </form>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-5">
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

              <div className="h-6 w-px bg-gray-200" />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 border border-gray-200 rounded-full pl-1.5 pr-3 py-1 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-black select-none">
                      {getInitials(user.name)}
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-gray-800 truncate mt-0.5">{user.email || user.name}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <User size={15} className="text-gray-400" />
                          Profile
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/orders"); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <Package size={15} className="text-gray-400" />
                          Orders
                        </button>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout(); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <LogOut size={15} className="text-red-400" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <NavLink to="/login" className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-yellow-600 transition-colors">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="px-6 py-2 text-sm font-bold text-white bg-yellow-500 rounded-full hover:bg-yellow-600 shadow-md transition-all active:scale-95">
                    Signup
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile: just hamburger for categories/search */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 focus:outline-none text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Categories Row */}
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
                {Icon && <Icon size={16} className="text-gray-400" />}
                {value.title}
              </NavLink>
            );
          })}
        </div>

        {/* Mobile Slide-down Menu (categories + search only) */}
        {menuOpen && (
          <div className="md:hidden px-4 pt-3 pb-4 bg-white shadow-md border-t space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
              />
              <button type="submit" className="text-amber-500 font-bold text-xs">Search</button>
            </form>

            {/* Category links */}
            <div className="flex flex-col gap-1">
              <button onClick={() => handleNavClick("/shop-all")} className="text-pink-600 font-semibold text-left flex items-center gap-2 py-2">
                <ShoppingBag size={17} /> Shop All
              </button>
              <button onClick={() => handleNavClick("/bestseller")} className="text-gray-700 hover:text-yellow-500 text-left flex items-center gap-2 py-2">
                <Zap size={17} /> Best Sellers
              </button>
              {Object.entries(categories).map(([key, value]) => {
                const Icon = iconMap[value.icon];
                return (
                  <button
                    key={key}
                    onClick={() => handleNavClick(`/category/${key}`)}
                    className="capitalize text-gray-700 hover:text-yellow-500 text-left flex items-center gap-2 py-2"
                  >
                    {Icon && <Icon size={17} />}
                    {value.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-stretch h-16">
          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/") ? "text-amber-500" : "text-gray-400"}`}
          >
            <Home size={21} strokeWidth={isActive("/") ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          {/* Categories */}
          <button
            onClick={() => navigate("/shop-all")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/shop-all") ? "text-amber-500" : "text-gray-400"}`}
          >
            <LayoutGrid size={21} strokeWidth={isActive("/shop-all") ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">Shop</span>
          </button>

          {/* Cart (centre, elevated) */}
          <button
            onClick={handleCartClick}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
          >
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors ${isActive("/cart") ? "bg-amber-500" : "bg-gray-900"}`}
              style={{ marginTop: "-20px" }}
            >
              <ShoppingCart size={20} className="text-white" strokeWidth={2} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold ${isActive("/cart") ? "text-amber-500" : "text-gray-400"}`}>Cart</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => navigate(user ? "/orders" : "/login")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/orders") ? "text-amber-500" : "text-gray-400"}`}
          >
            <Package size={21} strokeWidth={isActive("/orders") ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">Orders</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate(user ? "/profile" : "/login")}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/profile") || isActive("/login") ? "text-amber-500" : "text-gray-400"}`}
          >
            {user ? (
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white ${isActive("/profile") ? "bg-amber-500" : "bg-gray-400"}`}>
                {getInitials(user.name)}
              </div>
            ) : (
              <User size={21} strokeWidth={isActive("/login") ? 2.5 : 1.8} />
            )}
            <span className="text-[10px] font-semibold">{user ? "Profile" : "Login"}</span>
          </button>
        </div>
      </div>

      {/* Spacer so page content isn't hidden behind the bottom tab on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
};
