// Caminho do arquivo: src/repositories/tradeRepository.js

// Repositório de propostas de troca (fonte única de CRUD).
// Hoje persiste em localStorage; amanhã pode virar chamadas HTTP.
// - createProposal(payload, { userId? }): cria proposta nova
// - listReceived(userId?): lista propostas recebidas pelo usuário
// - listSent(userId?): lista propostas enviadas pelo usuário
// - updateStatus(id, status): atualiza status ('aguardando'|'aceito'|'recusado'|'cancelado')
// - removeProposal(id): remove proposta

// Detalhes:
// - Usa models/trade (newTradeProposal, TRADE_STATUS) como contrato de domínio.
// - Resolve targetOwnerId a partir do item alvo (mocks/items).
// - getCurrentUserId lê o usuário atual salvo pelo AuthContext.

import { load, save } from "../services/storage";
import { newTradeProposal, TRADE_STATUS } from "../models/trade";
import { getItemById } from "../mocks/items";

const KEY = "trade_proposals";

function getAll() {
  return load(KEY, []);
}
function setAll(rows) {
  save(KEY, rows);
}

// Sessão atual (AuthContext grava `currentUser` no localStorage)
function getCurrentUserId() {
  try {
    const raw = localStorage.getItem("currentUser");
    const user = raw ? JSON.parse(raw) : null;
    return user?.id ? String(user.id) : null;
  } catch {
    return null;
  }
}

/**
 * Cria uma nova proposta.
 * @param {{targetItemId:string, offeredItemId:string, message?:string}} payload
 * @param {{userId?:string}} [opts]
 * @returns {import("../models/trade").TradeProposal}
 */
export async function createProposal(
  { targetItemId, offeredItemId, message = "" },
  { userId } = {}
) {
  const offererId = String(userId ?? getCurrentUserId());
  if (!offererId) throw new Error("Usuário não autenticado.");

  const targetItem = getItemById(targetItemId);
  if (!targetItem) throw new Error("Item alvo não encontrado.");

  const proposal = newTradeProposal({
    targetItemId: String(targetItemId),
    targetOwnerId: String(targetItem.owner),
    offeredItemId: String(offeredItemId),
    offererId,
    message,
  });

  const all = getAll();
  all.push(proposal);
  setAll(all);
  return proposal;
}

/**
 * Propostas recebidas pelo usuário (owner do item alvo)
 */
export async function listReceived(userId) {
  const me = String(userId ?? getCurrentUserId() ?? "");
  if (!me) return [];
  return getAll().filter((p) => String(p.targetOwnerId) === me);
}

/**
 * Propostas enviadas pelo usuário (quem ofereceu)
 */
export async function listSent(userId) {
  const me = String(userId ?? getCurrentUserId() ?? "");
  if (!me) return [];
  return getAll().filter((p) => String(p.offererId) === me);
}

/**
 * Atualiza status da proposta
 */
export async function updateStatus(id, status) {
  const allowed = new Set(Object.values(TRADE_STATUS)); // 'aguardando','aceito','recusado','cancelado'
  if (!allowed.has(status)) throw new Error(`Status inválido: ${status}`);

  const all = getAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], status };
  setAll(all);
}

/**
 * Remove proposta
 */
export async function removeProposal(id) {
  setAll(getAll().filter((p) => p.id !== id));
}
