// Caminho: src/pages/WelcomePage.jsx
import React, { useMemo } from 'react';
import '../styles/pages/WelcomePage.css';

import HeroBanner from '../components/layout/HeroBanner';
import PopularCategories from '../components/layout/PopularCategories';
import AvailableProducts from '../components/layout/AvailableProducts';
import CallSection from '../components/layout/CallSection';

import { useAuth } from '../context/AuthContext';
import { loadTable } from '../services/storage';

const WelcomePage = () => {
  const { user, isAuthenticated } = useAuth();

  // Pega os itens do usuário logado para habilitar o botão "Propor Troca"
  const myItems = useMemo(() => {
    if (!isAuthenticated || !user?.id) return [];
    const all = loadTable("items");
    return all
      .filter((i) => String(i.owner) === String(user.id))
      .map((i) => ({ id: i.id, title: i.title }));
  }, [isAuthenticated, user?.id]);

  return (
    <div className="welcome-page" aria-labelledby="hero-title">
      <HeroBanner />
      <PopularCategories />

      {/* Vitrine de novidades (últimos itens) */}
      <AvailableProducts title="Novidades" limit={4} myItems={myItems} />

      <CallSection />
    </div>
  );
};

export default WelcomePage;
