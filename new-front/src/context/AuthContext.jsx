// Caminho do arquivo: src/context/AuthContext.jsx

// Este contexto gerencia autenticação no app (login, logout, perfil).
// - Mantém usuário e token em estado global.
// - Salva e lê dados do localStorage para persistência entre sessões.
// - Sincroniza sessão entre diferentes abas/janelas.
// - Expõe funções de login, logout e atualização de perfil.
// - Disponibiliza hook `useAuth` para consumir esses dados.

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

// Chaves padronizadas para uso no localStorage
const STORAGE = {
  USER: "ecobarter.currentUser",
  TOKEN: "ecobarter.authToken",
};

// Parse seguro de JSON (evita erro em caso de dados inválidos)
function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // dados do usuário logado
  const [token, setToken] = useState(null); // token de autenticação

  // Hidrata sessão a partir do localStorage ao montar o app
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

  // Sincroniza mudanças de login/logout entre abas/janelas
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

  // Realiza login → salva usuário e token no estado e localStorage
  const login = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
    localStorage.setItem("authToken", nextToken);
  };

  // Realiza logout → limpa estado e localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
  };

  // Atualiza perfil mantendo o token (patch ou objeto completo)
  const updateProfile = (patchOrUser) => {
    setUser((prev) => {
      const updated = typeof patchOrUser === "object" && patchOrUser.id
        ? patchOrUser
        : { ...(prev || {}), ...(patchOrUser || {}) };
      localStorage.setItem("currentUser", JSON.stringify(updated));
      return updated;
    });
  };

  // Valor exposto para os componentes
  const value = useMemo(() => ({
    user,
    token,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token, // booleano simples
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para consumir o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext);
}
