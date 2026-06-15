import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/Cart-context";
import { AuthContext } from "../context/AuthContext";
import { useCategories } from "../context/CategoriesContext";
import {
  LogOut, Home, Book, Paintbrush, Flower, Sprout, Baby, Sparkles, Nut,
  Zap, ShoppingBag, Menu, X, Search, ShoppingCart, User, ArrowLeft,
  ChevronDown, Package, LayoutGrid
} from "lucide-react";

const iconMap = { Home, Book, Paintbrush, Flower, Sprout, Baby, Sparkles, Nut };

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

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  if (auth.loading) {
    return (
      <nav className="w-full bg-slate-900 fixed top-0 left-0 right-0 z-40">
        <div className="h-16 flex items-center justify-center text-slate-400 text-sm">
          Loading...
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="w-full bg-slate-900 shadow-[0_2px_20px_rgba(0,0,0,0.3)] fixed top-0 left-0 right-0 z-40">
        {/* ── Top Header ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo + back */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {location.pathname !== "/" && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all active:scale-90"
                  aria-label="Go back"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <NavLink to="/" className="text-xl lg:text-2xl font-black tracking-tight text-white">
                Buy<span className="text-amber-500">Zone</span>
              </NavLink>
            </div>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className={`flex items-center gap-2 w-full rounded-xl px-4 py-2 transition-all duration-200 ${searchOpen ? "bg-slate-700 ring-2 ring-amber-500/50" : "bg-slate-800 hover:bg-slate-700"}`}>
                <Search size={15} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  placeholder="Search products…"
                  className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
                />
                {searchQuery && (
                  <button type="submit" className="text-amber-500 font-bold text-xs flex-shrink-0 hover:text-amber-400">Go</button>
                )}
              </div>
            </form>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-5 ml-auto">
              {/* Cart */}
              <button
                onClick={() => navigate(user ? "/cart" : "/login")}
                className="relative text-slate-300 hover:text-amber-400 transition-colors p-1"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cart.length}
                  </span>
                )}
              </button>

              <div className="h-5 w-px bg-slate-700" />

              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl pl-1.5 pr-3 py-1.5 transition-all active:scale-95"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center text-[10px] font-black select-none">
                      {getInitials(user.name)}
                    </div>
                    <span className="text-sm font-semibold text-slate-200 max-w-[80px] truncate">{user.name?.split(" ")[0]}</span>
                    <ChevronDown size={13} className={`text-slate-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{user.email || user.name}</p>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { setProfileOpen(false); navigate("/profile"); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                          <User size={15} className="text-slate-400" /> Profile
                        </button>
                        <button onClick={() => { setProfileOpen(false); navigate("/orders"); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                          <Package size={15} className="text-slate-400" /> Orders
                        </button>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                          <LogOut size={15} className="text-red-400" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="px-5 py-2 text-sm font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center ml-auto">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop Categories Row ── */}
        <div className="hidden md:flex justify-center flex-wrap gap-6 lg:gap-10 bg-slate-800 py-2.5 text-sm font-semibold border-t border-slate-700/50">
          <NavLink
            to="/shop-all"
            className={({ isActive }) => `transition-colors flex items-center gap-1.5 ${isActive ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
          >
            Shop All
          </NavLink>
          <NavLink
            to="/bestseller"
            className={({ isActive }) => `transition-colors flex items-center gap-1.5 ${isActive ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
          >
            Best Sellers
          </NavLink>
          {Object.entries(categories).map(([key, value]) => {
            const Icon = iconMap[value.icon];
            return (
              <NavLink
                key={key}
                to={`/category/${key}`}
                className={({ isActive }) => `capitalize transition-colors flex items-center gap-1.5 ${isActive ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
              >
                {Icon && <Icon size={14} />}
                {value.title}
              </NavLink>
            );
          })}
        </div>

        {/* ── Mobile Slide-down Menu ── */}
        {menuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 pt-3 pb-5 space-y-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-700 rounded-xl px-3 py-2.5">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none flex-1"
              />
              <button type="submit" className="text-amber-500 font-bold text-xs">Go</button>
            </form>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => handleNavClick("/shop-all")} className="text-amber-400 font-semibold text-left flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">
                <ShoppingBag size={16} /> Shop All
              </button>
              <button onClick={() => handleNavClick("/bestseller")} className="text-slate-300 font-semibold text-left flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">
                <Zap size={16} /> Best Sellers
              </button>
              {Object.entries(categories).map(([key, value]) => {
                const Icon = iconMap[value.icon];
                return (
                  <button key={key} onClick={() => handleNavClick(`/category/${key}`)} className="capitalize text-slate-300 font-semibold text-left flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">
                    {Icon && <Icon size={16} />}
                    {value.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-[6.5rem]" />

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
        <div className="flex items-stretch h-16">
          <button onClick={() => navigate("/")} className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/") ? "text-amber-600" : "text-slate-400"}`}>
            <Home size={21} strokeWidth={isActive("/") ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button onClick={() => navigate("/shop-all")} className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/shop-all") ? "text-amber-600" : "text-slate-400"}`}>
            <LayoutGrid size={21} strokeWidth={isActive("/shop-all") ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">Shop</span>
          </button>

          {/* Cart – elevated center */}
          <button onClick={() => navigate(user ? "/cart" : "/login")} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-2xl shadow-lg transition-all ${isActive("/cart") ? "bg-amber-500" : "bg-slate-900"}`}
              style={{ marginTop: "-20px" }}
            >
              <ShoppingCart size={20} className="text-white" strokeWidth={2} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold ${isActive("/cart") ? "text-amber-600" : "text-slate-400"}`}>Cart</span>
          </button>

          <button onClick={() => navigate(user ? "/orders" : "/login")} className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/orders") ? "text-amber-600" : "text-slate-400"}`}>
            <Package size={21} strokeWidth={isActive("/orders") ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">Orders</span>
          </button>

          <button onClick={() => navigate(user ? "/profile" : "/login")} className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive("/profile") || (!user && isActive("/login")) ? "text-amber-600" : "text-slate-400"}`}>
            {user ? (
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white ${isActive("/profile") ? "bg-amber-500" : "bg-slate-400"}`}>
                {getInitials(user.name)}
              </div>
            ) : (
              <User size={21} strokeWidth={1.8} />
            )}
            <span className="text-[10px] font-semibold">{user ? "Profile" : "Login"}</span>
          </button>
        </div>
      </div>
    </>
  );
};
