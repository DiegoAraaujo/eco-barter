import { Link } from "react-router-dom";
import "../../styles/components/catalog/CatalogFilters.css";

function CatalogFilters({ categories, selectedCategory }) {
  return (
    <div className="catalog-filters">
      <h3 className="filters-title">Categorias</h3>

      <div className="filter-categories">
        <Link
          to="/catalogo"
          className={`filter-category ${!selectedCategory ? "active" : ""}`}
        >
          Todas as categorias
        </Link>

        {categories.map((cat) => {
          const path = `/catalogo/${encodeURIComponent(cat.category)}`;
          const active = selectedCategory === cat.category;

          return (
            <Link
              key={cat.category}
              to={path}
              className={`filter-category ${active ? "active" : ""}`}
            >
              <span className="category-name">{cat.category}</span>
              <span className="category-count">({cat.count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default CatalogFilters;
