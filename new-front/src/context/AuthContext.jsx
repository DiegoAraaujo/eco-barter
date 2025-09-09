import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE = {
  USER: "ecobarter.currentUser",
  TOKEN: "ecobarter.authToken",
};

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   
  const [token, setToken] = useState(null); 
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("currentUser"));
      const savedToken = localStorage.getItem("authToken");
      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
    } catch { }
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE.USER || e.key === STORAGE.TOKEN) {
        const nextUser = safeParse(localStorage.getItem(STORAGE.USER));
        const nextToken = localStorage.getItem(STORAGE.TOKEN);
        setUser(nextUser || null);
        setToken(nextToken || null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
    localStorage.setItem("authToken", nextToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
  };

  const updateProfile = (patchOrUser) => {
    setUser((prev) => {
      const updated = typeof patchOrUser === "object" && patchOrUser.id
        ? patchOrUser
        : { ...(prev || {}), ...(patchOrUser || {}) };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      return updated;
    });
  };

  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token, 
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
