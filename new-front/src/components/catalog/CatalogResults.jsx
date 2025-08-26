// Caminho do arquivo: src/components/catalog/CatalogResults.jsx

// Este componente é responsável por exibir os resultados do catálogo:
// - Mostra o título da seção (categoria ou "Todos os itens")
// - Exibe a contagem de itens encontrados
// - Renderiza um grid de produtos usando o componente CardProduct
// - Caso não haja itens, mostra uma mensagem de "Nenhum item encontrado"

import CardProduct from "../ui/CardProduct"; // Card de produto individual
import "../../styles/components/catalog/CatalogResults.css"; // Estilos do componente

function CatalogResults({ items = [], category }) {
  // Conta a quantidade de itens recebidos
  const count = items.length;

  // Define o título com base na categoria selecionada
  const titleText = category ? `Categoria: ${category}` : "Todos os Itens";

  return (
    <section className="catalog-results" role="region" aria-label={titleText}>
      {/* Cabeçalho com título e quantidade de resultados */}
      <header className="results-header">
        <h1 className="results-title">{titleText}</h1>
        <p className="results-count" aria-live="polite">
          {count} {count === 1 ? "item encontrado" : "itens encontrados"}
        </p>
      </header>

      {/* Grid com os resultados */}
      <div className="results-grid" role="list">
        {count > 0 ? (
          // Renderiza cada item como um CardProduct
          items.map((item) => (
            <div role="listitem" key={item.id} className="results-slot">
              <CardProduct
                id={item.id}
                image={item.image}
                imageDescription={item.imageDescription}
                title={item.title}
                category={item.category}
                city={item.city}
                condition={item.condition}
              />
            </div>
          ))
        ) : (
          // Caso não existam itens para exibir
          <div className="no-results" role="status" aria-live="polite">
            <p>
              Nenhum item encontrado{category ? ` na categoria “${category}”` : ""}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CatalogResults;
