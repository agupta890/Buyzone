import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  // ✅ Check if user session is valid on page reload
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setAuth({ user: data.user, loading: false });
      } else if (res.status === 401) {
        // Not logged in → just clear state, no error log
        setAuth({ user: null, loading: false });
      } else {
        console.error("Auth check failed:", res.status);
        setAuth({ user: null, loading: false });
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setAuth({ user: null, loading: false });
    }
  };

  checkAuth();
}, []);

  // 🔹 Save user in context only
  const login = (userData) => {
    setAuth({ user: userData, loading: false });
  };

  // 🔹 Logout clears backend cookie only
  const logout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include", // ensures server clears cookie
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setAuth({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
