// Caminho do arquivo: src/pages/CatalogPage.jsx

// Página de Catálogo.
// - Lê a categoria via query (?categoria=) ou rota (/catalogo/:categoria).
// - Canonicaliza URL: se vier por query, redireciona para /catalogo/:categoria.
// - Carrega itens (mock) conforme a categoria selecionada.
// - Monta a barra lateral de filtros (com contagem por categoria) e os resultados.
// - Acessibilidade: regiões com aria-live/aria-busy durante carregamento.

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { getItemsByCategory, getAllItems, getCategoriesWithCount } from "../mocks/items";
import CatalogFilters from "../components/catalog/CatalogFilters";
import CatalogResults from "../components/catalog/CatalogResults";
import "../styles/pages/CatalogPage.css";

function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { categoria } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categoria efetiva (querystring tem prioridade sobre o param de rota)
  const category = searchParams.get("categoria") || categoria || "";

  // Efeito: Canonicaliza a URL (query -> rota /catalogo/:categoria)
  useEffect(() => {
    const qCat = searchParams.get("categoria");
    if (qCat && qCat !== categoria) {
      navigate(`/catalogo/${encodeURIComponent(qCat)}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categoria]);

  // Efeito: Carrega itens do mock conforme a categoria (simula fetch com pequeno delay)
  useEffect(() => {
    setLoading(true);
    const tid = setTimeout(() => {
      const list = category ? getItemsByCategory(category) : getAllItems();
      setItems(list);
      setLoading(false);
    }, 300);
    return () => clearTimeout(tid);
  }, [category]);

  // Memo: Lista de categorias com contagem (fonte estável no mock)
  const categories = useMemo(() => getCategoriesWithCount(), []);

  // Efeito: Atualiza o título da aba
  useEffect(() => {
    const base = "Catálogo — EcoBarter";
    document.title = category ? `${base} | ${category}` : base;
  }, [category]);

  // Estado de carregamento (aria-live anuncia mudanças)
  if (loading) {
    return (
      <div className="catalog-loading" aria-live="polite" aria-busy="true">
        Carregando itens...
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="catalog-container" aria-busy={loading || undefined}>
        {/* Filtros por categoria */}
        <aside className="catalog-sidebar">
          <CatalogFilters categories={categories} selectedCategory={category} />
        </aside>

        {/* Resultados do catálogo */}
        <main className="catalog-main">
          <CatalogResults items={items} category={category} />
        </main>
      </div>
    </div>
  );
}

export default CatalogPage;
