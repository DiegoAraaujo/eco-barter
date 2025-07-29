import React from 'react';
import { Outlet } from 'react-router-dom';
import Header1 from './Header1';
import Footer1 from './Footer1';
import '../../styles/components/layout/RootLayout.css';

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Header1 />

      <main
        id="conteudo-principal"
        className="main-content"
        role="main"
        tabIndex="-1" 
      >
        <Outlet />
      </main>

      <Footer1 />
    </div>
  );
};

export default RootLayout;
