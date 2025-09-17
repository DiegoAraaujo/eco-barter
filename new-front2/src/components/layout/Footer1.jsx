// Caminho do arquivo: src/components/layout/Footer1.jsx
// Este componente é o rodapé principal do site.
// - Mostra o nome da aplicação, uma frase de impacto e os links de Termos e Privacidade.
// - Exibe automaticamente o ano atual.
// - Pode ser fixado no final da tela (prop fixed = true).
// - Quando fixo, adiciona um "spacer" invisível para evitar sobreposição do conteúdo.

import React from 'react';
import '../../styles/components/layout/Footer1.css';

const Footer1 = ({ fixed = false }) => {
  // Obtém o ano atual dinamicamente
  const year = new Date().getFullYear();

  // Estrutura principal do rodapé
  const Footer = (
    <footer
      role="contentinfo"
      className={`site-footer ${fixed ? 'is-fixed' : ''}`}
      aria-label="Rodapé do site"
    >
      <div className="container footer-inner">
        {/* Texto institucional */}
        <p className="footer-text">
          <strong>EcoBarter</strong> — Conectando pessoas por meio de trocas conscientes.
        </p>

        {/* Links do rodapé */}
        <nav aria-label="Links do rodapé" className="footer-links">
          <a href="/termos" className="footer-link">Termos</a>
          <span aria-hidden="true" className="dot">•</span>
          <a href="/privacidade" className="footer-link">Privacidade</a>
        </nav>

        {/* Direitos autorais dinâmicos */}
        <small className="footer-copy">© {year} EcoBarter</small>
      </div>
    </footer>
  );

  // Se o rodapé for fixo, insere também um "spacer" invisível
  // para evitar que o conteúdo seja encoberto
  return fixed ? (
    <>
      {Footer}
      <div className="footer-spacer" aria-hidden="true" />
    </>
  ) : Footer;
};

export default Footer1;
