import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  // ✅ Restore user session on reload
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
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
      await fetch("http://localhost:3000/api/auth/logout", {
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
        <h1 className="text-white text-2xl font-bold animate-pulse">
          Loading your session...
        </h1>
      </div>
    </div>
  );
};
