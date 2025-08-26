// Caminho do arquivo: src/components/layout/HeroBanner.jsx

// Este componente exibe a seção "hero" da página inicial.
// - Mostra um título chamativo e uma descrição.
// - Possui botão para rolar até a próxima seção (scroll suave).
// - Respeita a preferência do usuário por movimento reduzido (prefers-reduced-motion).
// - Acessível: usa roles, aria-labelledby e aria-describedby.

import { useEffect, useRef, useState } from 'react';
import '../../styles/components/layout/HeroBanner.css';

function HeroBanner() {
  const sectionRef = useRef(null);                // referência da seção para calcular próximo scroll
  const [prefersReduced, setPrefersReduced] = useState(false); // se usuário prefere menos animação

  // Detecta preferência de movimento reduzido do sistema
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReduced(!!mq.matches);

      const onChange = (e) => setPrefersReduced(!!e.matches);
      mq.addEventListener?.('change', onChange);

      return () => mq.removeEventListener?.('change', onChange);
    }
  }, []);

  // Faz scroll suave até a próxima seção
  const handleScrollDown = () => {
    const next = sectionRef.current?.nextElementSibling;
    if (next?.scrollIntoView) {
      next.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  // Suporte para teclado (Enter, Espaço, Setas, PageDown)
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      handleScrollDown();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      aria-labelledby="hero-title"
      aria-describedby="hero-desc"
      role="region"
    >
      {/* Overlay para efeitos visuais (gradiente, imagem, etc.) */}
      <div className="hero-overlay" aria-hidden="true" />

      <div className="container hero-inner">
        {/* Título e descrição principais */}
        <div className="hero-section-title hb-reveal hb-delay-1">
          <h1 id="hero-title">Negocie de forma sustentável</h1>
          <p id="hero-desc">Conectando pessoas para trocas conscientes e ecológicas.</p>
        </div>

        {/* Botão que rola para a próxima seção */}
        <button
          type="button"
          className="scroll-down hb-reveal hb-delay-2"
          aria-label="Ir para o conteúdo"
          onClick={handleScrollDown}
          onKeyDown={onKeyDown}
        >
          <span>Saiba mais</span>
          <svg
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M12 16l-6-6h12l-6 6z" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default HeroBanner;
