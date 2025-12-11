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
   <div className="flex items-center justify-center h-screen bg-gradient-to-r from-yellow-400 to-yellow-600">
  <div className="flex flex-col items-center space-y-6">
    {/* Title */}
    <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-wide">
      BuyZone
    </h1>

    {/* Loader */}
    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>

    {/* Loading text */}
    <p className="text-black text-lg font-semibold animate-pulse">
      Loading your session...
    </p>
  </div>
</div>
  );
};
