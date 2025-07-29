import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/components/layout/Header1.css';

const Header1 = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <header role="banner" className="header">
      <div className="header-container">
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
          <NavLink to="/my-account" onClick={fecharMenu}>Minha Área</NavLink>
          <NavLink to="/personal-data" onClick={fecharMenu}>Meus Dados</NavLink>
          <NavLink to="/add-item" onClick={fecharMenu}>Cadastrar Item</NavLink>
          <NavLink to="/login" onClick={fecharMenu}>Sair</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header1;
