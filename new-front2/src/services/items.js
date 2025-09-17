// Caminho: src/services/items.js
// Serviço de itens (sem backend): lê da "tabela" localStorage 'items'.
// Suporta filtro por categoria em *slug* OU *rótulo*.
// Retorna { items, total, page, perPage }.

import { loadTable } from "../services/storage";
import { CATEGORY_BY_SLUG, prettyCategory } from "../constants/categories";

function normalizeCategoryFilter(category) {
  if (!category) return { slug: "", label: "" };
  const raw = String(category).trim();
  const slugKnown = CATEGORY_BY_SLUG[raw]?.name; // passou um slug conhecido?
  if (slugKnown) return { slug: raw, label: slugKnown };
  // caso tenha vindo um rótulo ("Livros"), garantimos a versão bonita
  return { slug: raw.toLowerCase(), label: prettyCategory(raw) };
}

export async function listItems({ page = 1, perPage = 24, category } = {}) {
  const all = loadTable("items"); // [{ id, title, category, categorySlug, owner, ...}]
  const { slug, label } = normalizeCategoryFilter(category);

  const filtered = all.filter((it) => {
    if (!slug && !label) return true;
    // aceita tanto slug quanto rótulo
    const hitSlug = String(it.categorySlug || "").toLowerCase() === slug.toLowerCase();
    const hitLabel = String(it.category || "").toLowerCase() === label.toLowerCase();
    return hitSlug || hitLabel;
  });

  // ordena por criação (desc)
  filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  // paginação
  const start = (Math.max(1, page) - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  // pequeno delay para simular fetch (opcional)
  await new Promise((r) => setTimeout(r, 150));

  return { items, total: filtered.length, page, perPage };
}

export async function listAllItems() {
  const all = loadTable("items");
  // pequeno delay opcional para consistência
  await new Promise((r) => setTimeout(r, 100));
  return all;
}

/** Busca um item pelo id (sem backend) */
export async function getItemById(id) {
  const all = loadTable("items");
  const found = all.find((it) => String(it.id) === String(id)) || null;
  // delay opcional, igual ao restante do serviço
  await new Promise((r) => setTimeout(r, 80));
  return found;
}
