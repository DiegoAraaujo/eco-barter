// Caminho do arquivo: src/components/layout/Header1.jsx

// Este componente é o cabeçalho principal da aplicação (header).
// - Mostra logotipo e menu de navegação (desktop e mobile).
// - Controla abertura/fechamento do menu hamburguer.
// - Adapta opções do menu conforme o usuário está autenticado ou não.
// - Exibe chip com nome/iniciais do usuário logado.
// - Permite logout e redireciona para a tela de login.

import { useState, useEffect, useMemo } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/layout/Header1.css";

const Header1 = ({ position = "sticky" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  // Estado do menu hamburguer (aberto/fechado)
  const [menuAberto, setMenuAberto] = useState(false);

  // Alterna o menu
  const toggleMenu = () => setMenuAberto((v) => !v);
  const fecharMenu = () => setMenuAberto(false);

  // Classe ativa para NavLink (menu)
  const linkClass = useMemo(
    () => ({ isActive }) => (isActive ? "active" : undefined),
    []
  );

  // Extrai primeiro nome e iniciais do usuário logado
  const { firstName, initials } = useMemo(() => {
    const name = String(user?.name || "").trim();
    if (!name) return { firstName: "Você", initials: "VC" };
    const parts = name.split(/\s+/);
    const first = parts[0];
    const second = parts[1] || "";
    const inits = (first[0] || "") + (second[0] || "");
    return {
      firstName: first,
      initials: inits.toUpperCase() || (first[0] || "V").toUpperCase()
    };
  }, [user?.name]);

  // Fecha menu quando a rota muda
  useEffect(() => { fecharMenu(); }, [location.pathname]);

  // Fecha menu ao apertar tecla ESC
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === "Escape") fecharMenu(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Bloqueia scroll do body quando menu mobile abre
  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuAberto);
    return () => document.body.classList.remove("no-scroll");
  }, [menuAberto]);

  // Fecha menu ao clicar em link ou no botão sair (mobile)
  const onNavClick = (e) => {
    if (e.target.closest("a, button.linklike-btn")) fecharMenu();
  };

  // Faz logout e redireciona para login
  const handleLogout = () => {
    logout();           // limpa contexto + localStorage
    navigate("/login"); // redireciona
  };

  return (
    <header className="site-header" data-position={position}>
      <div className="container">
        {/* Logotipo que volta para a página inicial */}
        <div className="nav-left">
          <Link to="/" aria-label="Ir para a página inicial">
            <img
              src="/img/logo1.png"  // arquivo em /public/img/logo1.png
              alt="Logotipo da EcoBarter"
              decoding="async"
              fetchPriority="auto"
            />
          </Link>

          {/* Botão hamburguer (visível no mobile) */}
          <button
            type="button"
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls="primary-nav"
            aria-haspopup="true"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>

        {/* Navegação principal */}
        <nav
          id="primary-nav"
          className={`nav-right ${menuAberto ? "is-open" : ""}`}
          aria-label="Menu principal"
          onClick={onNavClick}
        >
          {/* Se não autenticado → links públicos */}
          {!isAuthenticated ? (
            <>
              <NavLink to="/" end className={linkClass}>Início</NavLink>
              <NavLink to="/catalogo" className={linkClass}>Catálogo</NavLink>
              {location.pathname === "/login" ? (
                <NavLink to="/signup" className={linkClass}>Cadastro</NavLink>
              ) : location.pathname === "/signup" ? (
                <NavLink to="/login" className={linkClass}>Login</NavLink>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass}>Login</NavLink>
                  <NavLink to="/signup" className={linkClass}>Cadastro</NavLink>
                </>
              )}
            </>
          ) : (
            <>
              {/* Chip do usuário logado */}
              <span
                className="nav-user-chip"
                title={user?.name ? `Logado como ${user.name}` : "Usuário"}
                aria-label={user?.name ? `Logado como ${user.name}` : "Usuário"}
              >
                <span className="nav-user-avatar" aria-hidden="true">
                  {initials}
                </span>
                <span className="nav-user-name">Olá, {firstName}</span>
              </span>

              {/* Links privados */}
              <NavLink to="/" end className={linkClass}>Início</NavLink>
              <NavLink to="/catalogo" className={linkClass}>Catálogo</NavLink>
              <NavLink to="/my-area" className={linkClass}>Minha Área</NavLink>
              <NavLink to="/add-item" className={linkClass}>Cadastrar Item</NavLink>
              <NavLink to="/personal-data" className={linkClass}>Meus Dados</NavLink>

              {/* Botão de logout */}
              <button type="button" className="linklike-btn" onClick={handleLogout}>
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header1;
