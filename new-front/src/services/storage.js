// Caminho do arquivo: src/services/storage.js
//
// Serviço de persistência simples em localStorage com namespace fixo ("ecobarter").
// - load(key, fallback): lê e parseia JSON; retorna fallback em caso de erro/ausência.
// - save(key, value): grava valor (serializado em JSON) no localStorage sob chave namespaced.
// - remove(key): remove chave namespaced do localStorage.

const NAMESPACE = "ecobarter";

export const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`${NAMESPACE}:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const save = (key, value) => {
  try {
    localStorage.setItem(`${NAMESPACE}:${key}`, JSON.stringify(value));
  } catch {
    // Silencia falhas de quota / navegação privada
  }
};

export const remove = (key) => {
  try {
    localStorage.removeItem(`${NAMESPACE}:${key}`);
  } catch { }
};
