// Caminho do arquivo: src/components/layout/AuthLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import Header1 from "./Header1";
import Footer1 from "./Footer1";
import "../../styles/components/layout/AuthLayout.css";

const AuthLayout = () => {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  // Flags por rota (ajudam no CSS e em pequenos ajustes de layout)
  const { isWelcome, isLogin, isSignup, page } = useMemo(() => {
    const map = {
      "/": "welcome",
      "/login": "login",
      "/signup": "signup",
    };
    const p = map[pathname] || "public";
    return {
      isWelcome: p === "welcome",
      isLogin: p === "login",
      isSignup: p === "signup",
      page: p,
    };
  }, [pathname]);

  // Ao trocar de rota: sobe pro topo e foca o <main> (skip-link friendly)
  useEffect(() => {
    // scroll topo
    try { window.scrollTo({ top: 0, behavior: "instant" }); } catch { window.scrollTo(0, 0); }
    // foco no main para leitores de tela
    const main = mainRef.current;
    if (!main) return;
    // permite foco programático sem entrar no tab-order permanente
    const prevTabIndex = main.getAttribute("tabIndex");
    main.setAttribute("tabIndex", "-1");
    main.focus({ preventScroll: true });
    // limpa para não poluir a árvore
    const tid = setTimeout(() => {
      if (prevTabIndex === null) main.removeAttribute("tabIndex");
      else main.setAttribute("tabIndex", prevTabIndex);
    }, 0);
    return () => clearTimeout(tid);
  }, [pathname]);

  return (
    <div className="auth-layout" data-route={pathname} data-page={page}>
      {/* Skip link para pular direto ao conteúdo */}
      <a href="#auth-main" className="visually-hidden focusable">
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho global */}
      <Header1 position="sticky" />

      {/* Conteúdo principal (varia por rota) */}
      <main
        id="auth-main"
        ref={mainRef}
        role="main"
        className={`auth-main ${isWelcome ? "is-welcome" : ""} ${isLogin ? "is-login" : ""} ${isSignup ? "is-signup" : ""}`}
        aria-live="polite"
      >
        {isLogin ? (
          // Login ocupa largura total
          <Outlet />
        ) : isSignup ? (
          // Signup usa grid com painel + aside (controlado via CSS)
          <div className="auth-container">
            <Outlet />
          </div>
        ) : isWelcome ? (
          // Welcome controla o próprio layout
          <Outlet />
        ) : (
          // Outras páginas públicas: container centralizado
          <div className="container">
            <Outlet />
          </div>
        )}
      </main>

      {/* Rodapé global */}
      <Footer1 />
    </div>
  );
};

export default AuthLayout;
