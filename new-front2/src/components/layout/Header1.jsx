// Caminho do arquivo: src/components/layout/Header1.jsx
import { useState, useEffect, useMemo } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/layout/Header1.css";

const Header1 = ({ position = "sticky" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const [menuAberto, setMenuAberto] = useState(false);
  const toggleMenu = () => setMenuAberto((v) => !v);
  const fecharMenu = () => setMenuAberto(false);

  const linkClass = useMemo(
    () => ({ isActive }) => (isActive ? "active" : undefined),
    []
  );

  // Nome/ iniciais do usuário (primeiro + último nome)
  const { firstName, initials } = useMemo(() => {
    const name = String(user?.name || "").trim();
    if (!name) return { firstName: "Você", initials: "VC" };
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1] : "";
    const inits = (first[0] || "") + (last[0] || first[1] || "");
    return { firstName: first, initials: inits.toUpperCase() || "VC" };
  }, [user?.name]);

  useEffect(() => { fecharMenu(); }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === "Escape") fecharMenu(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuAberto);
    return () => document.body.classList.remove("no-scroll");
  }, [menuAberto]);

  const onNavClick = (e) => {
    if (e.target.closest("a, button.linklike-btn")) fecharMenu();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Monta ?from= para login/cadastro com base na rota atual (sem redirecionar de volta para /login ou /signup)
  const buildReturn = (to) => {
    const path = location.pathname + location.search + location.hash;
    const isAuthRoute = /^\/(login|signup)/.test(path);
    return isAuthRoute ? to : `${to}?from=${encodeURIComponent(path)}`;
  };

  return (
    <header className="site-header" data-position={position} role="banner">
      <div className="container">
        {/* Logo */}
        <div className="nav-left">
          <Link to="/" aria-label="Ir para a página inicial">
            <img
              src="/img/logo1.png"
              alt="Logotipo da EcoBarter"
              width="140"
              height="40"
              decoding="async"
              fetchPriority="auto"
            />
          </Link>

          {/* Hamburguer (mobile) */}
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

        {/* Navegação */}
        <nav
          id="primary-nav"
          className={`nav-right ${menuAberto ? "is-open" : ""}`}
          data-open={menuAberto ? "true" : "false"}
          aria-label="Menu principal"
          onClick={onNavClick}
        >
          {!isAuthenticated ? (
            <>
              <NavLink to="/" end className={linkClass}>Início</NavLink>
              <NavLink to="/catalogo" className={linkClass}>Catálogo</NavLink>
              <NavLink to={buildReturn("/login")} className={linkClass}>Login</NavLink>
              <NavLink to={buildReturn("/signup")} className={linkClass}>Cadastro</NavLink>
            </>
          ) : (
            <>
              {/* Chip do usuário */}
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
