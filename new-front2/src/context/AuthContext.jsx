// Caminho do arquivo: src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

// Chaves atuais (alinhadas com services/auth)
const KEYS = {
  USER: "currentUser",
  TOKEN: "authToken",
};

// Chaves antigas (para migração/compat)
const LEGACY_KEYS = {
  USER: "ecobarter.currentUser",
  TOKEN: "ecobarter.authToken",
};

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Migra chaves antigas -> novas (uma vez)
  useEffect(() => {
    try {
      const legacyUserRaw = localStorage.getItem(LEGACY_KEYS.USER);
      const legacyToken = localStorage.getItem(LEGACY_KEYS.TOKEN);
      const currentUserRaw = localStorage.getItem(KEYS.USER);
      const currentToken = localStorage.getItem(KEYS.TOKEN);

      // Se só existir legado, migra
      if (!currentUserRaw && legacyUserRaw) {
        localStorage.setItem(KEYS.USER, legacyUserRaw);
        localStorage.removeItem(LEGACY_KEYS.USER);
      }
      if (!currentToken && legacyToken) {
        localStorage.setItem(KEYS.TOKEN, legacyToken);
        localStorage.removeItem(LEGACY_KEYS.TOKEN);
      }
    } catch {}
  }, []);

  // Hidrata sessão
  useEffect(() => {
    try {
      const savedUser = safeParse(localStorage.getItem(KEYS.USER));
      const savedToken = localStorage.getItem(KEYS.TOKEN);
      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
    } catch {}
  }, []);

  // Sincroniza entre abas (ouve novas e antigas para compat)
  useEffect(() => {
    const onStorage = () => {
      const nextUser = safeParse(localStorage.getItem(KEYS.USER)) ?? safeParse(localStorage.getItem(LEGACY_KEYS.USER));
      const nextToken = localStorage.getItem(KEYS.TOKEN) ?? localStorage.getItem(LEGACY_KEYS.TOKEN);
      setUser(nextUser || null);
      setToken(nextToken || null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(nextUser));
      localStorage.setItem(KEYS.TOKEN, nextToken);
    } catch {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(KEYS.USER);
      localStorage.removeItem(KEYS.TOKEN);
      // limpeza legado por via das dúvidas
      localStorage.removeItem(LEGACY_KEYS.USER);
      localStorage.removeItem(LEGACY_KEYS.TOKEN);
    } catch {}
  };

  const updateProfile = (patchOrUser) => {
    setUser((prev) => {
      const updated =
        (patchOrUser && typeof patchOrUser === "object" && "id" in patchOrUser)
          ? patchOrUser
          : { ...(prev || {}), ...(patchOrUser || {}) };
      try {
        localStorage.setItem(KEYS.USER, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      updateProfile,
      isAuthenticated: !!token,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
