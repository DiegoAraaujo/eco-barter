// Caminho do arquivo: src/components/catalog/CatalogFilters.jsx

import { Link } from "react-router-dom";
import "../../styles/components/catalog/CatalogFilters.css";

/**
 * Aceita categorias nos formatos:
 * - { category: string, count: number }
 * - { name: string, count: number }
 */
function CatalogFilters({ categories = [], selectedCategory }) {
  // Normaliza para { category, count }
  const normalized = categories.map((c) => ({
    category: c.category ?? c.name ?? "Outros",
    count: typeof c.count === "number" ? c.count : 0,
  }));

  const encode = (s) => encodeURIComponent(String(s || ""));

  return (
    <div className="catalog-filters">
      <h3 className="filters-title">Categorias</h3>

      <div className="filter-categories">
        <Link
          to="/catalogo"
          className={`filter-category ${!selectedCategory ? "active" : ""}`}
          aria-current={!selectedCategory ? "page" : undefined}
        >
          Todas as categorias
        </Link>

        {normalized.length === 0 ? (
          <span className="filter-category disabled" aria-disabled="true">
            (sem categorias)
          </span>
        ) : (
          normalized.map((cat) => {
            const active = selectedCategory === cat.category;
            return (
              <Link
                key={cat.category}
                to={`/catalogo/${encode(cat.category)}`}
                className={`filter-category ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="category-name">{cat.category}</span>
                <span className="category-count">({cat.count})</span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CatalogFilters;

