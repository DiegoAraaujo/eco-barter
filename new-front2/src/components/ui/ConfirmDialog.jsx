// Caminho do arquivo: src/components/ui/ConfirmDialog.jsx
// Este componente renderiza um modal de confirmação reutilizável.
// - Exibe título, descrição opcional e botões de Cancelar/Confirmar.
// - Suporta modo "destrutivo" (botão vermelho).
// - Implementa acessibilidade (focus trap, aria-modal, aria-labelledby).
// - Trava o scroll da página enquanto aberto.
// - Garante foco inicial e devolve o foco ao fechar.
// - Pode fechar ao clicar no backdrop (exceto se disableBackdropClose = true).

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/components/ui/ConfirmDialog.css';

export default function ConfirmDialog({
  open,                         // controla abertura do modal
  title = 'Confirmar ação',     // título exibido
  description,                  // descrição opcional
  confirmText = 'Confirmar',    // texto do botão de confirmar
  cancelText = 'Cancelar',      // texto do botão de cancelar
  onConfirm,                    // callback do confirmar
  onCancel,                     // callback do cancelar/fechar
  destructive = false,          // estilo de ação perigosa (botão vermelho)
  loading = false,              // estado de carregamento (desabilita botões)
  disableBackdropClose = false, // bloqueia fechar clicando fora
  initialFocus = 'confirm',     // define foco inicial: 'confirm' | 'cancel'
}) {
  const overlayRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const lastActiveRef = useRef(null);

  // Efeito: controla foco inicial, bloqueio de scroll e devolve foco ao fechar
  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;

    const el = initialFocus === 'cancel' ? cancelBtnRef.current : confirmBtnRef.current;
    setTimeout(() => el?.focus(), 0);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      lastActiveRef.current?.focus?.();
    };
  }, [open, initialFocus]);

  // Efeito: fecha com ESC e mantém foco preso no modal (focus trap)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel?.();
      } else if (e.key === 'Tab') {
        const nodes = overlayRef.current?.querySelectorAll('[data-focus]') || [];
        const list = Array.from(nodes);
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  // Se fechado → não renderiza nada
  if (!open) return null;

  // Clique no backdrop (se permitido) fecha o modal
  const onBackdrop = (e) => {
    if (disableBackdropClose) return;
    if (e.target === e.currentTarget) onCancel?.();
  };

  // Estrutura do diálogo
  const dialog = (
    <div
      className="cdlg-overlay"
      ref={overlayRef}
      onMouseDown={onBackdrop}
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cdlg-title"
        aria-describedby={description ? 'cdlg-desc' : undefined}
        className="cdlg-panel"
      >
        <div className="cdlg-body">
          <h2 id="cdlg-title" className="cdlg-title">{title}</h2>
          {description && <p id="cdlg-desc" className="cdlg-desc">{description}</p>}
        </div>

        <div className="cdlg-actions">
          {/* Botão de cancelar */}
          <button
            type="button"
            className="btn btn--ghost cdlg-btn"
            onClick={onCancel}
            data-focus
            ref={cancelBtnRef}
            disabled={loading}
          >
            {cancelText}
          </button>

          {/* Botão de confirmar */}
          <button
            type="button"
            className={`btn ${destructive ? 'btn--danger' : 'btn--primary'} cdlg-btn`}
            onClick={onConfirm}
            data-focus
            ref={confirmBtnRef}
            disabled={loading}
            aria-busy={loading || undefined}
          >
            {loading ? 'Aguarde...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // Renderiza o modal em portal (fora da árvore normal da UI)
  return createPortal(dialog, document.body);
}
