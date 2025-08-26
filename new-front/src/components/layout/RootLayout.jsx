// Caminho do arquivo: src/components/layout/RootLayout.jsx
// Este componente define o layout principal da aplicação (após login).
// - Inclui Header e Footer fixos em todas as páginas.
// - Usa <Outlet /> para renderizar as páginas internas.
// - Garante acessibilidade com "skip link" e foco automático no conteúdo.
// - Reseta o scroll para o topo ao trocar de rota.

import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header1 from './Header1';
import Footer1 from './Footer1';
import '../../styles/components/layout/RootLayout.css';

const RootLayout = () => {
  const { pathname } = useLocation(); // Captura o caminho da rota atual
  const mainRef = useRef(null);       // Referência para a área principal

  // Efeito executado sempre que a rota muda
  useEffect(() => {
    // Foca no conteúdo principal (boa prática de acessibilidade)
    mainRef.current?.focus();

    // Garante que a página role para o topo ao navegar
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="root-layout" data-route={pathname}>
      {/* Link de acessibilidade para pular direto para o conteúdo */}
      <a href="#conteudo-principal" className="visually-hidden focusable">
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho fixo em todas as rotas internas */}
      <Header1 />

      {/* Área principal que muda conforme a rota (Outlet) */}
      <main
        id="conteudo-principal"
        ref={mainRef}
        className="main-content"
        role="main"
        tabIndex={-1}        // Permite receber foco via JS
        aria-live="polite"   // Atualiza leitores de tela de forma amigável
      >
        {/* As páginas internas definem seu próprio layout (container, full-bleed, etc.) */}
        <Outlet />
      </main>

      {/* Rodapé fixo em todas as rotas internas */}
      <Footer1 />
    </div>
  );
};

export default RootLayout;
