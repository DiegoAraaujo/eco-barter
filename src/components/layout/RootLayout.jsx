import React from 'react';
import { Outlet } from 'react-router-dom';
import Header1 from './Header1';
import Footer1 from './Footer1';
import '../../styles/components/layout/RootLayout.css';

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Header1 />
<<<<<<< HEAD
      
=======

>>>>>>> 20300d1c254b49074defb42414083bb6556da0db
      <main
        id="conteudo-principal"
        className="main-content"
        role="main"
<<<<<<< HEAD
        tabIndex="-1"
      >
        <div className="content-container">
          <Outlet />
        </div>
=======
        tabIndex="-1" 
      >
        <Outlet />
>>>>>>> 20300d1c254b49074defb42414083bb6556da0db
      </main>

      <Footer1 />
    </div>
  );
};

export default RootLayout;