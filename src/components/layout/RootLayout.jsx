import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Header />

      <main
        className="main-content"
        id="conteudo-principal"
        role="main"
        style={{
          paddingTop: '60px',     // altura do Header
          paddingBottom: '40px',  // altura do Footer
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
