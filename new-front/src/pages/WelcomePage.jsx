// Caminho do arquivo: src/pages/WelcomePage.jsx

// Página inicial (Landing / Welcome).
// - Composição de seções públicas:
//   • <HeroBanner />: herói com slogan/CTA para rolar a página.
//   • <PopularCategories />: carrossel de categorias populares (com ícones).
//   • <AvailableProducts />: vitrine de itens recentes (limitados a 4).
//   • <CallSection />: “chamada final” para cadastro ou ir à área do usuário.
// - A página usa aria-labelledby apontando para o título do HeroBanner para acessibilidade.

import React from 'react';
import '../styles/pages/WelcomePage.css';

import HeroBanner from '../components/layout/HeroBanner';
import PopularCategories from '../components/layout/PopularCategories';
import AvailableProducts from '../components/layout/AvailableProducts';
import CallSection from '../components/layout/CallSection';

const WelcomePage = () => {
  return (
    <div className="welcome-page" aria-labelledby="hero-title">
      {/* Seção de destaque com CTA para rolar */}
      <HeroBanner />

      {/* Carrossel de categorias populares */}
      <PopularCategories />

      {/* Vitrine de novidades (últimos itens) */}
      <AvailableProducts title="Novidades" limit={4} />

      {/* Chamada para ação (cadastre-se / minha área) */}
      <CallSection />
    </div>
  );
};

export default WelcomePage;
