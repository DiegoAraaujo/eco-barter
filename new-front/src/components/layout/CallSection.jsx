// Caminho do arquivo: src/components/layout/CallSection.jsx
// Esta seção é uma "chamada final" (CTA) para incentivar cadastro.
// - Exibe título, descrição e ilustração.
// - Botão principal: se usuário NÃO estiver logado → navega para /signup;
//   se JÁ estiver logado → abre um diálogo informativo com atalho para "Minha Área".
// - Aplica efeito de revelação ao entrar na viewport (com respeito a prefers-reduced-motion).
// - Acessível com aria-labelledby/aria-describedby e foco controlado pelo ConfirmDialog.

import { useEffect, useRef, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/layout/CallSection.css";
import ButtonLarge from "../ui/ButtonLarge";
import ConfirmDialog from "../ui/ConfirmDialog";

function CallSection({
  title = "Comece a transformar sua forma de consumir",
  description = "Cadastre-se agora e descubra como pequenas ações podem gerar grandes mudanças! A EcoBarter conecta você a uma comunidade sustentável e colaborativa. Dê um novo destino ao que você já tem e encontre o que precisa — sem desperdício.",
  imageSrc = "/assets/backgrounds/welcome-image.svg",
  id, // opcional: permite ancoragem externa com <a href="#id">
}) {
  const sectionRef = useRef(null);       // referência do container da seção (para reveals)
  const headingId = useId();             // id acessível do título
  const descId = useId();                // id acessível da descrição
  const navigate = useNavigate();

  const [openInfo, setOpenInfo] = useState(false); // controla o ConfirmDialog

  // Checa autenticação via localStorage (alinhado ao AuthContext)
  const isAuthenticated = () => {
    try { return !!localStorage.getItem("authToken"); } catch { return false; }
  };

  // Handler do CTA:
  // - logado → abre modal informativo
  // - anônimo → vai para /signup
  const handleCtaClick = () => {
    if (isAuthenticated()) {
      setOpenInfo(true);
      return;
    }
    navigate("/signup");
  };

  // Efeito de revelação dos elementos ao entrar na viewport
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const toReveal = root.querySelectorAll(".reveal-in");
    if (prefersReduced) {
      toReveal.forEach((el) => el.classList.add("is-visible"));
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
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    toReveal.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id={id}
        className="call-section"
        aria-labelledby={headingId}
        aria-describedby={descId}
        role="region"
      >
        {/* container padrão: centraliza e aplica gutters */}
        <div className="container">
          <div className="last-call-container card reveal-in">
            {/* Ilustração/decoração */}
            <div className="call-section-image reveal-in reveal-delay-1" aria-hidden="true">
              <img
                src={imageSrc}
                alt=""
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>

            {/* Mensagem + CTA */}
            <div className="call-section-message reveal-in reveal-delay-2">
              <h2 id={headingId}>{title}</h2>
              <p id={descId}>{description}</p>

              <div className="call-section-cta">
                <ButtonLarge type="button" onClick={handleCtaClick} block>
                  Quero me cadastrar
                </ButtonLarge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal informando que o usuário já tem cadastro */}
      <ConfirmDialog
        open={openInfo}
        title="Você já possui cadastro"
        description="Detectamos que você já tem uma conta ativa. Acesse sua área para gerenciar seus itens e propostas."
        cancelText="Fechar"
        confirmText="Ir para Minha Área"
        onCancel={() => setOpenInfo(false)}
        onConfirm={() => { setOpenInfo(false); navigate("/my-area"); }}
        destructive={false}
        loading={false}
        disableBackdropClose={false}
        initialFocus="cancel"
      />
    </>
  );
}

export default CallSection;
