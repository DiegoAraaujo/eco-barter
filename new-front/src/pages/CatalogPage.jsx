import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CatalogFilters from "../components/catalog/CatalogFilters";
import CatalogResults from "../components/catalog/CatalogResults";
import "../styles/pages/CatalogPage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function CatalogPage() {
  const { categoria } = useParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/item/catalog`);
        let data = res.data;

        if (!Array.isArray(data)) {
          if (Array.isArray(data.items)) data = data.items;
          else data = [];
        }

        setItems(data);

        const catMap = {};
        data.forEach((item) => {
          const cat = item.category || "Sem categoria";
          catMap[cat] = (catMap[cat] || 0) + 1;
        });

        const catList = Object.entries(catMap).map(([cat, count]) => ({
          category: cat,
          count,
        }));

        setCategories(catList);
      } catch (err) {
        console.error("Erro ao carregar itens:", err);
        setItems([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const filteredItems = categoria
    ? items.filter(
        (item) =>
          (item.category || "").toLowerCase() ===
          decodeURIComponent(categoria).toLowerCase()
      )
    : items;

  // título da aba
  useEffect(() => {
    document.title = categoria
      ? `Catálogo — ${decodeURIComponent(categoria)}`
      : "Catálogo — EcoBarter";
  }, [categoria]);

  if (loading) {
    return (
      <div className="catalog-loading" aria-live="polite" aria-busy="true">
        Carregando itens...
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="catalog-container">
        <aside className="catalog-sidebar">
          <CatalogFilters
            categories={categories}
            selectedCategory={categoria ? decodeURIComponent(categoria) : ""}
          />
        </aside>
        <main className="catalog-main">
          <CatalogResults
            items={filteredItems}
            category={categoria ? decodeURIComponent(categoria) : ""}
          />
        </main>
      </div>
    </div>
  );
}

export default CatalogPage;
