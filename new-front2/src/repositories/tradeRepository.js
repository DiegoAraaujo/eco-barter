// Caminho: src/repositories/tradeRepository.js

// Repositório de propostas de troca (fonte única de CRUD).
// Agora sem dependência de mocks: quem chama createProposal precisa informar o targetOwnerId.
// - createProposal(payload, { userId?, targetOwnerId? })
// - listReceived(userId?)
// - listSent(userId?)
// - updateStatus(id, status)
// - removeProposal(id)

import { load, save } from "../services/storage";
import { newTradeProposal, TRADE_STATUS } from "../models/trade";

export const KEY = "trade_proposals";

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

function assertAuthenticated(userId) {
  if (!userId) throw new Error("Usuário não autenticado.");
}

/**
 * Cria uma nova proposta.
 * @param {{targetItemId:string, offeredItemId:string, message?:string}} payload
 * @param {{userId?:string, targetOwnerId?:string}} [opts]
 *  - targetOwnerId: **obrigatório** enquanto não há backend (não buscamos mais nos mocks)
 * @returns {import("../models/trade").TradeProposal}
 */
export async function createProposal(
  { targetItemId, offeredItemId, message = "" },
  { userId, targetOwnerId } = {}
) {
  const offererId = String(userId ?? getCurrentUserId() ?? "");
  assertAuthenticated(offererId);

  if (!targetItemId) throw new Error("targetItemId é obrigatório.");
  if (!offeredItemId) throw new Error("offeredItemId é obrigatório.");

  // Sem mocks: precisamos receber o dono do item alvo
  if (!targetOwnerId) {
    const err = new Error(
      "targetOwnerId é obrigatório enquanto o backend está em construção. " +
      "Passe o owner do item alvo no segundo parâmetro: { targetOwnerId: item.owner }."
    );
    err.code = "TARGET_OWNER_REQUIRED";
    throw err;
  }

  const proposal = newTradeProposal({
    targetItemId: String(targetItemId),
    targetOwnerId: String(targetOwnerId),
    offeredItemId: String(offeredItemId),
    offererId: offererId,
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
