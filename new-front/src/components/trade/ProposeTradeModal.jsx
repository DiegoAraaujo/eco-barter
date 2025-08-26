// Caminho do arquivo: src/components/trade/ProposeTradeModal.jsx

// Este componente renderiza um modal acessível para propor uma troca.
// - Abre a partir de um card de produto (CardProduct).
// - Permite escolher um item do usuário logado para oferecer em troca.
// - Permite adicionar uma mensagem opcional.
// - Impede propor troca em itens do próprio usuário.
// - Usa foco controlado, bloqueio de scroll e trap de foco para acessibilidade.
// - Executa a criação da proposta via TradeContext (create).

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTrade } from "../../context/useTrade";
import { getAllItems } from "../../mocks/items";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/ui/ConfirmDialog.css"; // reaproveita estilos do ConfirmDialog
import "../../styles/components/trade/ProposeTradeModal.css";

/**
 * Props:
 * - open: boolean → controla visibilidade
 * - onClose: () => void → fecha o modal
 * - targetItemId: string → id do item alvo da troca
 * - myItems: lista de itens do usuário logado
 * - disableBackdropClose?: boolean → bloqueia fechar ao clicar fora
 * - initialFocus?: 'submit' | 'cancel' → botão com foco inicial
 */
export default function ProposeTradeModal({
  open,
  onClose,
  targetItemId,
  myItems = [],
  disableBackdropClose = false,
  initialFocus = "submit",
}) {
  const { create } = useTrade(); // função de criar proposta (TradeContext)
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : null;

  // Refs para acessibilidade
  const overlayRef = useRef(null);
  const submitBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const lastActiveRef = useRef(null);

  // Estado do formulário
  const [offeredItemId, setOfferedItemId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Dados do item alvo (apenas título exibido)
  const targetItem = useMemo(
    () => getAllItems().find((i) => String(i.id) === String(targetItemId)),
    [targetItemId]
  );

  // Regra: não pode propor troca para item próprio
  const isOwnItem = useMemo(() => {
    return targetItem && userId && String(targetItem.owner) === userId;
  }, [targetItem, userId]);

  // Efeito: foco inicial + bloqueio de scroll + devolve foco ao fechar
  useEffect(() => {
    if (!open) return;
    lastActiveRef.current = document.activeElement;

    const el = initialFocus === "cancel" ? cancelBtnRef.current : submitBtnRef.current;
    setTimeout(() => el?.focus(), 0);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      lastActiveRef.current?.focus?.();
    };
  }, [open, initialFocus]);

  // Efeito: ESC fecha modal e Tab mantém foco preso dentro do modal (focus trap)
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if (e.key === "Tab") {
        const nodes = overlayRef.current?.querySelectorAll("[data-focus]") || [];
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
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Efeito: reset do formulário sempre que o modal abre
  useEffect(() => {
    if (!open) return;
    setOfferedItemId("");
    setMessage("");
    setLoading(false);
    setErrorMsg("");
  }, [open]);

  if (!open) return null;

  // Fechar clicando fora (se permitido)
  const onBackdrop = (e) => {
    if (disableBackdropClose) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  const hasMyItems = myItems?.length > 0;

  // Envio do formulário
  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (!offeredItemId || loading) return;
    if (isOwnItem) {
      setErrorMsg("Você não pode propor troca com um item seu.");
      return;
    }

    try {
      setLoading(true);
      await create({ targetItemId, offeredItemId, message });
      onClose?.();
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || "Não foi possível enviar a proposta.");
    } finally {
      setLoading(false);
    }
  };

  // Estrutura do modal
  const dialog = (
    <div className="cdlg-overlay" ref={overlayRef} onMouseDown={onBackdrop} aria-hidden={false}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ptm-title"
        aria-describedby="ptm-desc"
        className="cdlg-panel"
      >
        <div className="cdlg-body">
          <h2 id="ptm-title" className="cdlg-title">Propor troca</h2>
          <p id="ptm-desc" className="cdlg-desc">
            Você está propondo uma troca para: <strong>{targetItem?.title ?? "Item"}</strong>.
            {hasMyItems
              ? " Escolha um dos seus itens para oferecer e, se quiser, deixe uma mensagem."
              : " Você ainda não possui itens cadastrados para oferecer."}
          </p>

          {isOwnItem && (
            <p className="cdlg-warning" role="alert" aria-live="polite">
              Este item é seu. Não é possível propor troca para o próprio item.
            </p>
          )}

          {/* Formulário */}
          <form onSubmit={onSubmit} className="ptm-form">
            {/* Seleção de item para oferecer */}
            <label className="ptm-field">
              <span>Meu item para oferecer</span>
              <select
                value={offeredItemId}
                onChange={(e) => setOfferedItemId(e.target.value)}
                required
                disabled={!hasMyItems || loading || isOwnItem}
                data-focus
              >
                <option value="">Selecione...</option>
                {myItems.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.title || it.nome || `Item ${it.id}`}
                  </option>
                ))}
              </select>
            </label>

            {/* Mensagem opcional */}
            <label className="ptm-field">
              <span>Mensagem (opcional)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Ex.: Posso retirar no local combinado..."
                disabled={loading || isOwnItem}
              />
            </label>

            {/* Mensagem de erro */}
            {errorMsg && (
              <p className="cdlg-error" role="alert" aria-live="polite">
                {errorMsg}
              </p>
            )}
          </form>
        </div>

        {/* Botões de ação */}
        <div className="cdlg-actions">
          <button
            type="button"
            className="btn btn--ghost cdlg-btn"
            onClick={onClose}
            data-focus
            ref={cancelBtnRef}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn--primary cdlg-btn"
            onClick={onSubmit}
            data-focus
            ref={submitBtnRef}
            disabled={!hasMyItems || !offeredItemId || loading || isOwnItem}
            aria-busy={loading || undefined}
          >
            {loading ? "Enviando..." : "Enviar proposta"}
          </button>
        </div>
      </div>
    </div>
  );

  // Renderização do modal em portal (fora da hierarquia normal)
  return createPortal(dialog, document.body);
}
