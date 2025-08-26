// Caminho do arquivo: src/components/catalog/CatalogFilters.jsx

// Este componente renderiza os filtros de categorias do catálogo,
// permitindo ao usuário selecionar uma categoria específica ou ver todas.

// Importa o componente Link para navegação interna com React Router
import { Link } from "react-router-dom";
// Importa o arquivo de estilos específico para os filtros de catálogo
import "../../styles/components/catalog/CatalogFilters.css";

/**
 * CatalogFilters
 * 
 * Props:
 * - categories: lista de objetos de categorias (ex: [{ category: "Livros", count: 5 }, ...])
 * - selectedCategory: categoria atualmente selecionada (string)
 * 
 * Função:
 * - Exibe os filtros de categorias.
 * - Inclui um link "Todas as categorias".
 * - Gera links para cada categoria recebida em `categories`.
 * - Destaca visualmente a categoria selecionada com a classe "active".
 */
function CatalogFilters({ categories, selectedCategory }) {
  return (
    <div className="catalog-filters">
      {/* Título da seção de filtros */}
      <h3 className="filters-title">Categorias</h3>

      <div className="filter-categories">
        {/* Link para mostrar todos os itens (sem filtro de categoria) */}
        <Link
          to="/catalogo"
          className={`filter-category ${!selectedCategory ? "active" : ""}`}
        >
          Todas as categorias
        </Link>

        {/* Mapeia todas as categorias recebidas por props */}
        {categories.map((cat) => {
          // Define a rota com base na categoria
          const path = `/catalogo/${encodeURIComponent(cat.category)}`;
          // Verifica se a categoria está ativa/selecionada
          const active = selectedCategory === cat.category;

          return (
            <Link
              key={cat.category}
              to={path}
              className={`filter-category ${active ? "active" : ""}`}
            >
              {/* Nome da categoria */}
              <span className="category-name">{cat.category}</span>
              {/* Quantidade de itens na categoria */}
              <span className="category-count">({cat.count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default CatalogFilters;
