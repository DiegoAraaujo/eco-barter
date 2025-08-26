// Caminho do arquivo: src/components/layout/AuthLayout.jsx

// Este componente define o layout das páginas públicas/autenticadas (login, signup, welcome).
// - Controla a estrutura padrão com Header, Footer e conteúdo principal.
// - Ajusta a renderização de acordo com a rota atual (/login, /signup, /).
// - Garante acessibilidade com "skip link" para pular direto ao conteúdo principal.

import { Outlet, useLocation } from 'react-router-dom';
import Header1 from './Header1';
import Footer1 from './Footer1';
import '../../styles/components/layout/AuthLayout.css';

const AuthLayout = () => {
  // Hook para obter o caminho atual da rota
  const { pathname } = useLocation();

  // Identifica as páginas específicas para aplicar estilos/classes diferentes
  const isWelcome = pathname === '/';
  const isLogin   = pathname === '/login';
  const isSignup  = pathname === '/signup';

  // Header configurado sempre como variante "default"
  const headerVariant = 'default';
  const headerTint = 'gray';

  return (
    <div className="auth-layout" data-route={pathname}>
      {/* Link de acessibilidade para ir direto ao conteúdo principal */}
      <a href="#auth-main" className="visually-hidden focusable">
        Pular para o conteúdo principal
      </a>

      {/* Cabeçalho fixo para todas as páginas */}
      <Header1 variant={headerVariant} tint={headerTint} />

      {/* Área principal que adapta o layout de acordo com a rota */}
      <main
        id="auth-main"
        role="main"
        className={`auth-main ${isWelcome ? 'is-welcome' : ''} ${isLogin ? 'is-login' : ''} ${isSignup ? 'is-signup' : ''}`}
        aria-live="polite"
      >
        {isLogin ? (
          // Página de login ocupa toda a largura
          <Outlet />
        ) : isSignup ? (
          // Página de signup usa grid com painel + aside
          <div className="auth-container">
            <Outlet />
          </div>
        ) : isWelcome ? (
          // Página de boas-vindas controla a própria largura
          <Outlet />
        ) : (
          // Outras páginas públicas usam container centralizado
          <div className="container">
            <Outlet />
          </div>
        )}
      </main>

      {/* Rodapé fixo em todas as páginas */}
      <Footer1 />
    </div>
  );
};

export default AuthLayout;
