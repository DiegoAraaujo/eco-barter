import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../../styles/components/layout/RootLayout.css';

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Header />

      <main
        id="conteudo-principal"
        className="main-content"
        role="main"
        tabIndex="-1" 
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
