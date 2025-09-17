// Caminho do arquivo: src/services/storage.js
//
// Serviço de persistência simples em localStorage com namespace fixo ("ecobarter").
// - load(key, fallback): lê e parseia JSON; retorna fallback em caso de erro/ausência.
// - save(key, value): grava valor (serializado em JSON) no localStorage sob chave namespaced.
// - remove(key): remove chave namespaced do localStorage.
// - loadTable(key, fallback): especial p/ arrays de registros (coleções).
// - saveTable(key, rows): idem, garante serialização segura.

const NAMESPACE = "ecobarter";

// Lê um valor do localStorage e faz parse de JSON
export const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`${NAMESPACE}:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Grava um valor no localStorage (como JSON)
export const save = (key, value) => {
  try {
    localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(value));
  } catch {
    // Silencia falhas de quota / navegação privada
  }
};

// Remove um valor do localStorage
export const remove = (key) => {
  try {
    localStorage.removeItem(`${NAMESPACE}:${key}`);
  } catch { }
};

/** Helpers “por tabela” (array de registros) */
export const loadTable = (tableName) => {
  const v = load(tableName, []);
  return Array.isArray(v) ? v : [];
};

export const saveTable = (tableName, rows) => {
  save(tableName, Array.isArray(rows) ? rows : []);
};