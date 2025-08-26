// Caminho do arquivo: src/mocks/items.js

// Este módulo centraliza os itens de demonstração e os itens salvos no mock DB.
// - Define metadados de categorias (nome, descrição, slug, ícone).
// - Fornece funções utilitárias para buscar, normalizar e filtrar itens.
// - Combina itens fixos DEMO com itens armazenados no localStorage (via loadTable).
// - É a "fonte única de verdade" para componentes como catálogo, carrossel e cards.

import { loadTable } from "./db";

// === Imports de imagens demo ===
import harryPotterBox from "../assets/img/harry-potter-box.png";
import geladeiraBrastemp from "../assets/img/geladeira-brastemp.png";
import blazerReserva from "../assets/img/blazer-reserva.png";
import tenisNike from "../assets/img/tenis-nike.png";
import sofaRed from "../assets/img/sofa-red.png";
import kitPesca from "../assets/img/kit-pesca.png";
import notebookDell from "../assets/img/notebook-dell.png";
import iphone11 from "../assets/img/iphone11.png";
import carrinhoRc from "../assets/img/carrinho-rc.png";
import kitJardinagem from "../assets/img/kit-jardinagem.png";
import placeholder from "../assets/img/placeholder.png";

/* ==========================
   Categorias e metadados
   ========================== */
export const categoryData = {
  Livros: { iconName: "book", description: "Livros usados em bom estado", slug: "livros" },
  Eletrodomésticos: { iconName: "home", description: "Eletrodomésticos seminovos", slug: "eletrodomesticos" },
  Roupas: { iconName: "clothing", description: "Roupas em ótimo estado", slug: "roupas" },
  Calçados: { iconName: "shoe", description: "Calçados com pouco uso", slug: "calcados" },
  Móveis: { iconName: "armchair", description: "Móveis em bom estado", slug: "moveis" },
  Esportes: { iconName: "sport", description: "Artigos esportivos", slug: "esportes" },
  Informática: { iconName: "electronics", description: "Equipamentos de informática", slug: "informatica" },
  Celulares: { iconName: "smartphone", description: "Celulares e acessórios", slug: "celulares" },
  Brinquedos: { iconName: "toy", description: "Brinquedos em bom estado", slug: "brinquedos" },
  Jardinagem: { iconName: "sprout", description: "Artigos para jardinagem", slug: "jardinagem" },
};

export const CATEGORIES = Object.keys(categoryData);

// Mapeia slugs para metadados completos
export const CATEGORY_BY_SLUG = Object.fromEntries(
  Object.entries(categoryData).map(([name, meta]) => [meta.slug, { name, ...meta }])
);

/* ==========================
   Utils de normalização
   ========================== */
const normalize = (v) => String(v ?? "").trim().toLowerCase();
const toSlug = (s) =>
  String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

// Retorna nome legível da categoria a partir de slug ou nome
export const prettyCategory = (slugOrName) => {
  const key = String(slugOrName || "");
  const bySlug = CATEGORY_BY_SLUG[key];
  if (bySlug) return bySlug.name;
  return Object.prototype.hasOwnProperty.call(categoryData, key) ? key : key;
};

/* ==========================
   Itens DEMO (estáticos)
   ========================== */
export const mockItems = [
  {
    id: "1",
    title: "Box Harry Potter - Coleção Completa",
    category: "Livros",
    categoryId: "livros",
    city: "São Paulo",
    description: "Coleção completa dos 7 livros da saga Harry Potter, edição de capa dura.",
    image: harryPotterBox,
    condition: "Usado - Como novo",
    owner: "user_me",
    createdAt: "2023-10-05",
  },
  {
    id: "2",
    title: "Geladeira Frost Free Brastemp",
    category: "Eletrodomésticos",
    categoryId: "eletrodomesticos",
    city: "Rio de Janeiro",
    description: "375 L, branca, com dispenser de água na porta. Funcionando perfeitamente.",
    image: geladeiraBrastemp,
    condition: "Usado - Boas condições",
    owner: "user102",
    createdAt: "2023-09-15",
  },
  {
    id: "3",
    title: "Blazer Masculino Tamanho 42",
    category: "Roupas",
    categoryId: "roupas",
    city: "Belo Horizonte",
    description: "Blazer social azul marinho, marca Reserva. Usado poucas vezes.",
    image: blazerReserva,
    condition: "Usado - Excelente estado",
    owner: "user_me",
    createdAt: "2023-11-10",
  },
  {
    id: "4",
    title: "Tênis Nike Air Max Tamanho 40",
    category: "Calçados",
    categoryId: "calcados",
    city: "Porto Alegre",
    description: "Tênis preto e branco, pouco usado. Solado em perfeito estado.",
    image: tenisNike,
    condition: "Usado - Como novo",
    owner: "user104",
    createdAt: "2023-08-22",
  },
  {
    id: "5",
    title: "Sofá 3 Lugares Retrátil",
    category: "Móveis",
    categoryId: "moveis",
    city: "Curitiba",
    description: "Sofá em couro sintético vermelho, com assento retrátil. Alguns sinais de uso.",
    image: sofaRed,
    condition: "Usado - Boas condições",
    owner: "user105",
    createdAt: "2023-07-30",
  },
  {
    id: "6",
    title: "Kit de Pesca Completo",
    category: "Esportes",
    categoryId: "esportes",
    city: "Recife",
    description: "Inclui vara, carretilha, anzóis e acessórios. Ideal para iniciantes.",
    image: kitPesca,
    condition: "Usado - Bom estado",
    owner: "user106",
    createdAt: "2023-10-18",
  },
  {
    id: "7",
    title: "Notebook Dell i5 8GB RAM",
    category: "Informática",
    categoryId: "informatica",
    city: "Salvador",
    description: "SSD 256 GB, tela 15,6”. Funcionando perfeitamente, bateria com boa duração.",
    image: notebookDell,
    condition: "Usado - Excelente estado",
    owner: "user107",
    createdAt: "2023-09-05",
  },
  {
    id: "8",
    title: "iPhone 11 64GB",
    category: "Celulares",
    categoryId: "celulares",
    city: "Fortaleza",
    description: "Cor vermelha, com capa protetora e película. 100% funcional.",
    image: iphone11,
    condition: "Usado - Como novo",
    owner: "user108",
    createdAt: "2023-11-02",
  },
  {
    id: "9",
    title: "Carrinho de Controle Remoto",
    category: "Brinquedos",
    categoryId: "brinquedos",
    city: "Brasília",
    description: "Bateria recarregável, controle remoto incluso. Funcionando perfeitamente.",
    image: carrinhoRc,
    condition: "Usado - Bom estado",
    owner: "user109",
    createdAt: "2023-10-12",
  },
  {
    id: "10",
    title: "Kit Jardinagem",
    category: "Jardinagem",
    categoryId: "jardinagem",
    city: "Florianópolis",
    description: "Inclui tesoura de poda, ancinho, pá e luvas. Itens em bom estado.",
    image: kitJardinagem,
    condition: "Usado - Boas condições",
    owner: "user_me",
    createdAt: "2023-09-28",
  },
  {
    id: "11",
    title: "Dom Casmurro - Machado de Assis",
    category: "Livros",
    categoryId: "livros",
    city: "São Paulo",
    description: "Edição especial de capa dura, em ótimo estado.",
    image: placeholder,
    condition: "Usado - Excelente estado",
    owner: "user111",
    createdAt: "2023-11-15",
  },
  {
    id: "12",
    title: "Micro-ondas Panasonic 30 L",
    category: "Eletrodomésticos",
    categoryId: "eletrodomesticos",
    city: "Belo Horizonte",
    description: "Inox, com função grill. Funcionando perfeitamente.",
    image: placeholder,
    condition: "Usado - Boas condições",
    owner: "user112",
    createdAt: "2023-10-22",
  },
  {
    id: "13",
    title: "Vestido Floral Tam. M",
    category: "Roupas",
    categoryId: "roupas",
    city: "Rio de Janeiro",
    description: "Vestido de verão, usado apenas uma vez.",
    image: placeholder,
    condition: "Usado - Como novo",
    owner: "user113",
    createdAt: "2023-11-05",
  },
].map((i) => ({
  ...i,
  categorySlug: i.categoryId || toSlug(i.category),
}));

/* ==========================
   Normalização (storage)
   ========================== */
// Converte item salvo no storage para formato padronizado
function normalizeStoredItem(i) {
  const title = i.title || i.titulo || "Item";
  const description = i.description || i.descricao || "";
  const categoryRaw = i.category || i.categoria || "outros";
  const categorySlug = i.categorySlug || toSlug(categoryRaw);

  return {
    id: String(i.id),
    title,
    description,
    category: categoryRaw,
    categorySlug,
    image: i.image || null,
    imageDescription: i.imageDescription || `Foto de ${title}`,
    city: i.city || "",
    owner: String(i.owner || ""),
    condition: i.condition || "Usado",
    createdAt: i.createdAt || Date.now(),
  };
}

/* ==========================
   Fonte única de verdade
   ========================== */
// Retorna todos os itens (mock + storage)
export function getAllItems() {
  const stored = (loadTable("items") || []).map(normalizeStoredItem);

  // Combina DEMO + storage, priorizando storage em caso de id duplicado
  const map = new Map(mockItems.map((d) => [String(d.id), d]));
  for (const s of stored) map.set(String(s.id), s);

  return Array.from(map.values());
}

// Busca item pelo id
export function getItemById(id) {
  return getAllItems().find((item) => item.id === String(id)) || null;
}

// Busca itens por categoria (aceita slug ou nome)
export function getItemsByCategory(category) {
  if (!category) return getAllItems();
  const key = String(category);
  const slug = toSlug(key);
  return getAllItems().filter(
    (i) => i.category === key || i.categorySlug === key || i.categorySlug === slug
  );
}

// Compatibilidade legada (categoryId ≈ slug)
export function getItemsByCategoryId(categoryId) {
  if (!categoryId) return getAllItems();
  const key = String(categoryId);
  const slug = toSlug(key);
  return getAllItems().filter((i) => i.categorySlug === key || i.categorySlug === slug);
}

// Retorna categorias com contagem de itens
export function getCategoriesWithCount() {
  const counts = new Map();
  for (const i of getAllItems()) {
    const slug = i.categorySlug || toSlug(i.category);
    counts.set(slug, (counts.get(slug) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

// Retorna categorias mais populares (limit padrão = 10)
export const getPopularCategories = (limit = 10) =>
  getCategoriesWithCount().slice(0, limit);

// Busca itens por termo livre (título, descrição, categoria, cidade)
export function searchItems(searchTerm) {
  const term = normalize(searchTerm);
  if (!term) return getAllItems();
  return getAllItems().filter((item) =>
    [item.title, item.description, item.category, item.city]
      .map(normalize)
      .some((field) => field.includes(term))
  );
}

// Busca itens por cidade
export function getItemsByCity(city) {
  const target = normalize(city);
  return getAllItems().filter((item) => normalize(item.city) === target);
}

// Busca itens por condição (ex.: "como novo", "bom estado")
export function getItemsByCondition(condition) {
  const term = normalize(condition);
  if (!term) return getAllItems();
  return getAllItems().filter((item) => normalize(item.condition).includes(term));
}