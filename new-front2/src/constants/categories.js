// Caminho: src/constants/categories.js

// Mapa slug -> rótulo exibido
export const CATEGORY_BY_SLUG = {
  animais: { name: "Animais" },
  moveis: { name: "Móveis" },
  livros: { name: "Livros" },
  roupas: { name: "Roupas" },
  eletronicos: { name: "Eletrônicos" },
  casa: { name: "Casa" },
  calcados: { name: "Calçados" },
  smartphones: { name: "Smartphones" },
  esportes: { name: "Esportes" },
  jardinagem: { name: "Jardinagem" },
  brinquedos: { name: "Brinquedos" },
  veiculos: { name: "Veículos" },
};

// Converte slug em rótulo "bonito" caso não exista no mapa
export function prettyCategory(slug = "") {
  if (!slug) return "Outros";
  const found = CATEGORY_BY_SLUG[slug]?.name;
  if (found) return found;
  // fallback simples: "minha-categoria" -> "Minha Categoria"
  return String(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}
