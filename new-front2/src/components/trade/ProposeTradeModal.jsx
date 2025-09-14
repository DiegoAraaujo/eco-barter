// Caminho do arquivo: src/components/trade/ProposeTradeModal.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTrade } from "../../context/useTrade";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/ui/ConfirmDialog.css";
import "../../styles/components/trade/ProposeTradeModal.css";

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - targetItemId: string        (mantido para compatibilidade)
 * - targetItem?: { id, owner, title }  <-- NOVO: recomendado (evita mocks)
 * - myItems: array de itens do usuário logado [{ id, title, ... }]
 * - disableBackdropClose?: boolean
 * - initialFocus?: 'submit' | 'cancel'
 */
export default function ProposeTradeModal({
  open,
  onClose,
  targetItemId,
  targetItem,                // <- NOVO
  myItems = [],
  disableBackdropClose = false,
  initialFocus = "submit",
}) {
  const { create } = useTrade();
  const { user } = useAuth();
  const userId = user?.id ? String(user.id) : null;

  const overlayRef = useRef(null);
  const submitBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const lastActiveRef = useRef(null);

  const [offeredItemId, setOfferedItemId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sem mocks: usamos diretamente o que veio por props
  const effectiveTargetItem = useMemo(() => {
    // fallback mínimo para não quebrar UI se o pai ainda não enviar targetItem
    return targetItem ?? { id: targetItemId, owner: undefined, title: "Item" };
  }, [targetItem, targetItemId]);

  const isOwnItem = useMemo(() => {
    return (
      effectiveTargetItem &&
      userId &&
      String(effectiveTargetItem.owner ?? "") === userId
    );
  }, [effectiveTargetItem, userId]);

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

  useEffect(() => {
    if (!open) return;
    setOfferedItemId("");
    setMessage("");
    setLoading(false);
    setErrorMsg("");
  }, [open]);

  if (!open) return null;

  const onBackdrop = (e) => {
    if (disableBackdropClose) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  const hasMyItems = myItems?.length > 0;

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (!offeredItemId || loading) return;

    if (isOwnItem) {
      setErrorMsg("Você não pode propor troca com um item seu.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      // IMPORTANTE: passamos o targetOwnerId via options (sem mocks!)
      await create(
        {
          targetItemId: effectiveTargetItem.id,
          offeredItemId,
          message,
        },
        {
          targetOwnerId: String(effectiveTargetItem.owner ?? ""),
        }
      );

      onClose?.();
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.message ||
        "Não foi possível enviar a proposta."
      );
    } finally {
      setLoading(false);
    }
  };

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
            Você está propondo uma troca para:{" "}
            <strong>{effectiveTargetItem?.title ?? "Item"}</strong>.
            {hasMyItems
              ? " Escolha um dos seus itens para oferecer e, se quiser, deixe uma mensagem."
              : " Você ainda não possui itens cadastrados para oferecer."}
          </p>

          {isOwnItem && (
            <p className="cdlg-warning" role="alert" aria-live="polite">
              Este item é seu. Não é possível propor troca para o próprio item.
            </p>
          )}

          <form onSubmit={onSubmit} className="ptm-form">
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

            {errorMsg && (
              <p className="cdlg-error" role="alert" aria-live="polite">
                {errorMsg}
              </p>
            )}
          </form>
        </div>

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

  return createPortal(dialog, document.body);
}
