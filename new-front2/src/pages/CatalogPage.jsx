// Caminho: src/pages/CatalogPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { listItems, listAllItems } from "../services/items"; // <-- importa os dois
import { prettyCategory } from "../constants/categories";
import { useAuth } from "../context/AuthContext";
import { loadTable } from "../services/storage";
import CatalogFilters from "../components/catalog/CatalogFilters";
import CatalogResults from "../components/catalog/CatalogResults";
import "../styles/pages/CatalogPage.css";

function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { categoria } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [allItems, setAllItems] = useState([]); // <-- novo: base para filtros
  const [items, setItems] = useState([]);       // itens da lista (filtrados)
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const rawCategory = searchParams.get("categoria") || categoria || "";
  const categoryLabel = rawCategory ? prettyCategory(rawCategory) : "";

  // Canonicaliza query -> rota
  useEffect(() => {
    const qCat = searchParams.get("categoria");
    if (qCat && qCat !== categoria) {
      navigate(`/catalogo/${encodeURIComponent(qCat)}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categoria]);

  // Carrega TODOS os itens (para montar as categorias com contagem)
  useEffect(() => {
    let alive = true;
    listAllItems()
      .then((all) => { if (alive) setAllItems(Array.isArray(all) ? all : (all?.items || [])); })
      .catch(() => { if (alive) setAllItems([]); });
    return () => { alive = false; };
  }, []);

  // Carrega itens filtrados para a grade
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErrorMsg("");

    listItems({ page: 1, perPage: 24, category: rawCategory })
      .then((res) => {
        if (!alive) return;
        const list = Array.isArray(res) ? res : (res?.items || []);
        setItems(list);
      })
      .catch((e) => {
        if (!alive) return;
        setErrorMsg(e?.message || "Não foi possível carregar o catálogo.");
        setItems([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => { alive = false; };
  }, [rawCategory]);

  // Monta categorias com contagem a partir de TODOS os itens
  const categories = useMemo(() => {
    const map = new Map();
    for (const it of allItems) {
      const label = it?.category || "Outros";
      map.set(label, (map.get(label) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
      .map(([category, count]) => ({ category, count }));
  }, [allItems]);

  // Itens do usuário logado para habilitar o botão "Propor Troca"
  const myItems = useMemo(() => {
    if (!isAuthenticated || !user?.id) return [];
    // use os "allItems" já carregados; se preferir, pode usar loadTable("items")
    return (allItems || [])
      .filter((it) => String(it.owner) === String(user.id))
      .map((it) => ({ id: it.id, title: it.title }));
  }, [allItems, isAuthenticated, user?.id]);

  useEffect(() => {
    const base = "Catálogo — EcoBarter";
    document.title = categoryLabel ? `${base} | ${categoryLabel}` : base;
  }, [categoryLabel]);

  if (loading) {
    return (
      <div className="catalog-loading" aria-live="polite" aria-busy="true">
        Carregando itens...
      </div>
    );
  }
  if (errorMsg) {
    return (
      <div className="catalog-error" role="alert">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="catalog-container" aria-busy={loading || undefined}>
        <aside className="catalog-sidebar">
          <CatalogFilters
            categories={categories}
            selectedCategory={categoryLabel}
          />
        </aside>

        <main className="catalog-main">
          <CatalogResults
            items={items}
            category={categoryLabel}
            myItems={myItems}
          />
        </main>
      </div>
    </div>
  );
}

export default CatalogPage;
