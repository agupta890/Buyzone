import { createContext, useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });
  

  // ✅ Restore user session on reload
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include", // send cookie
        });

        if (res.ok) {
          const data = await res.json();
          setAuth({ user: data.user, loading: false });
        } else {
          setAuth({ user: null, loading: false });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuth({ user: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  // 🔹 Login (backend sets cookie, we just update state)
  const login = (userData) => {
    setAuth({ user: userData, loading: false });
  };

  // 🔹 Logout (backend clears cookie)
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setAuth({ user: null, loading: false });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {auth.loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

// 🎨 Fancy loading screen
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F8F9FA] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-200 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="flex flex-col items-center z-10">
        {/* Logo Container with Glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl border border-amber-100 transform transition-transform hover:scale-105 duration-500">
             <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1A1A1A]">
               Buy<span className="text-amber-500">Zone</span>
             </h1>
          </div>
        </div>

        {/* Animated Progress Track */}
        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-amber-500 animate-loading-bar rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center">
          <p className="text-[#333] text-sm font-bold tracking-[0.2em] uppercase opacity-80">
            Secure Entry
          </p>
          <div className="flex mt-1">
             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mx-0.5 animate-bounce"></span>
             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
             <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-gray-400 text-xs font-medium tracking-widest uppercase">
        Premium Shopping Experience
      </div>
    </div>
  );
};
