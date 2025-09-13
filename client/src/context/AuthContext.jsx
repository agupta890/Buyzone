import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  // ✅ Check user on page reload
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token"); // get JWT
      if (!token) {
        setAuth({ user: null, loading: false });
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send JWT
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAuth({ user: data.user, loading: false });
        } else {
          // token invalid/expired
          localStorage.removeItem("token");
          setAuth({ user: null, loading: false });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuth({ user: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  // 🔹 Login: save user + token
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setAuth({ user: userData, loading: false });
  };

  // 🔹 Logout: remove token
  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
