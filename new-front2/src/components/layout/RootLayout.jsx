// Caminho do arquivo: src/components/layout/RootLayout.jsx
// Layout principal após login, com skip-link, foco no conteúdo e scroll-to-top.

import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header1 from "./Header1";
import Footer1 from "./Footer1";
import "../../styles/components/layout/RootLayout.css";

const RootLayout = () => {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    // Scroll para o topo (fallback se 'instant' não existir)
    try {
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      window.scrollTo(0, 0);
    }

    // Foco no conteúdo principal de forma não intrusiva no tab-order
    const main = mainRef.current;
    if (!main) return;

    const prevTabIndex = main.getAttribute("tabIndex");
    main.setAttribute("tabIndex", "-1");
    main.focus({ preventScroll: true });

    // restaura tabIndex no próximo tick
    const tid = setTimeout(() => {
      if (prevTabIndex === null) main.removeAttribute("tabIndex");
      else main.setAttribute("tabIndex", prevTabIndex);
    }, 0);

    return () => clearTimeout(tid);
  }, [pathname]);

  return (
    <div className="root-layout" data-route={pathname}>
      {/* Skip link para pular direto ao conteúdo */}
      <a href="#conteudo-principal" className="visually-hidden focusable">
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho global */}
      <header role="banner">
        <Header1 position="sticky" />
      </header>

      {/* Área principal (conteúdo das rotas internas) */}
      <main
        id="conteudo-principal"
        ref={mainRef}
        className="main-content"
        role="main"
        aria-live="polite"
      >
        <Outlet />
      </main>

      {/* Rodapé global */}
      <Footer1 />
    </div>
  );
};

export default RootLayout;
