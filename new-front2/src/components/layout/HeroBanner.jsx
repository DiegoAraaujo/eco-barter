// Caminho do arquivo: src/components/layout/HeroBanner.jsx
// Seção hero com a11y, motion-safe e reveals por IntersectionObserver.

import { useEffect, useRef, useState, useId } from "react";
import "../../styles/components/layout/HeroBanner.css";

function HeroBanner({
  title = "Negocie de forma sustentável",
  description = "Conectando pessoas para trocas conscientes e ecológicas.",
  ctaLabel = "Saiba mais",
}) {
  const sectionRef = useRef(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // IDs acessíveis estáveis (evita conflitos se renderizar 2x)
  const headingId = useId();
  const descId = useId();

  // Detecta prefers-reduced-motion e escuta alterações
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReduced(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Scroll suave até a próxima seção (respeita prefers-reduced-motion)
  const handleScrollDown = () => {
    const next = sectionRef.current?.nextElementSibling;
    if (next?.scrollIntoView) {
      next.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  // Teclado: Enter, Espaço, Seta Baixo, PageDown
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      handleScrollDown();
    }
  };

  // Revela elementos com .hb-reveal ao entrar na viewport
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".hb-reveal");

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // reexecuta se a preferência mudar, para aplicar/retirar animação de forma consistente
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      aria-labelledby={headingId}
      aria-describedby={descId}
      role="region"
    >
      {/* Overlay decorativo (gradiente/imagem) */}
      <div className="hero-overlay" aria-hidden="true" />

      <div className="container hero-inner">
        {/* Título + descrição */}
        <div className="hero-section-title hb-reveal hb-delay-1">
          <h1 id={headingId}>{title}</h1>
          <p id={descId}>{description}</p>
        </div>

        {/* Botão para ir ao conteúdo */}
        <button
          type="button"
          className="scroll-down hb-reveal hb-delay-2"
          aria-label="Ir para o conteúdo"
          onClick={handleScrollDown}
          onKeyDown={onKeyDown}
        >
          <span>{ctaLabel}</span>
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
