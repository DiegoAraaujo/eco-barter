// Caminho do arquivo: src/models/trade.js

// Modelo e utilitários para propostas de troca (TradeProposal).
// - Define o typedef para padronizar os campos.
// - Fornece constantes de status válidos.
// - Função `newTradeProposal` cria um objeto consistente com valores default.
// - Preparado para futura integração com API (comentários abaixo).

/**
 * @typedef {Object} TradeProposal
 * @property {string} id                - Identificador único da proposta
 * @property {string} targetItemId      - ID do item desejado (alvo da troca)
 * @property {string} targetOwnerId     - Dono do item-alvo
 * @property {string} offeredItemId     - ID do item oferecido na troca
 * @property {string} offererId         - Usuário que está propondo a troca
 * @property {'aguardando'|'aceito'|'recusado'|'cancelado'} status - Estado da proposta
 * @property {string} [message]         - Mensagem opcional ao dono do item
 * @property {string} createdAt         - Data/hora de criação (ISO string)
 */

/** Conjunto de status válidos para propostas de troca */
export const TRADE_STATUS = {
  AGUARDANDO: "aguardando",
  ACEITO: "aceito",
  RECUSADO: "recusado",
  CANCELADO: "cancelado",
};

/**
 * Cria uma nova proposta de troca com dados consistentes.
 * @param {Object} params
 * @param {string} params.targetItemId
 * @param {string} params.targetOwnerId
 * @param {string} params.offeredItemId
 * @param {string} params.offererId
 * @param {string} [params.message]
 * @returns {TradeProposal}
 */
export function newTradeProposal({
  targetItemId,
  targetOwnerId,
  offeredItemId,
  offererId,
  message = "",
}) {
  const nowIso = new Date().toISOString();
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    targetItemId,
    targetOwnerId,
    offeredItemId,
    offererId,
    status: TRADE_STATUS.AGUARDANDO,
    message,
    createdAt: nowIso,
  };
}

/* ===================================================
   📌 Futuro: integração com API real
   Substituir chamadas locais por fetch/axios:
   - createProposal(payload) → POST /proposals
   - listReceived() → GET /proposals?type=received
   - listSent() → GET /proposals?type=sent
   - updateStatus(id, status) → PATCH /proposals/:id
   - removeProposal(id) → DELETE /proposals/:id
   =================================================== */
