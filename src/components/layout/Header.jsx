import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/components/Header.css';

const Header = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <header role="banner" className="header">
      <div className="nav-left">
        <img src="/img/logo1.png" alt="Logotipo da EcoBarter" />
      </div>

      <button
        className="menu-toggle"
        onClick={toggleMenu}
        aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuAberto}
        aria-controls="menu-principal"
      >
        ☰
      </button>

      <nav
        className={`nav-right ${menuAberto ? 'ativo' : ''}`}
        id="menu-principal"
        aria-label="Menu principal"
      >
        <NavLink to="/" end onClick={fecharMenu}>Início</NavLink>
        <NavLink to="/my-area" onClick={fecharMenu}>Minha Área</NavLink>
        <NavLink to="/personal-data" onClick={fecharMenu}>Meus Dados</NavLink>
        <NavLink to="/add-item" onClick={fecharMenu}>Cadastrar Item</NavLink>
        <NavLink to="/login" onClick={fecharMenu}>Sair</NavLink>
      </nav>
    </header>
  );
};

export default Header;
