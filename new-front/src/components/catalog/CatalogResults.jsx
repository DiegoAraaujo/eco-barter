import CardProduct from "../ui/CardProduct";
import "../../styles/components/catalog/CatalogResults.css";

function CatalogResults({ items = [], category }) {
  const count = items.length;
  const titleText = category ? `Categoria: ${category}` : "Todos os Itens";

  return (
    <section className="catalog-results" role="region" aria-label={titleText}>
      <header className="results-header">
        <h1 className="results-title">{titleText}</h1>
        <p className="results-count" aria-live="polite">
          {count} {count === 1 ? "item encontrado" : "itens encontrados"}
        </p>
      </header>

      <div className="results-grid" role="list">
        {count > 0 ? (
          items.map((item) => (
            <div role="listitem" key={item.id} className="results-slot">
              <CardProduct
                id={item.id}
                image={item.imageUrl}
                imageDescription={item.description}
                title={item.name}
                category={item.category}
                city={item.account?.city}
                condition={item.condition}
              />
            </div>
          ))
        ) : (
          <div className="no-results" role="status" aria-live="polite">
            <p>
              Nenhum item encontrado
              {category ? ` na categoria “${category}”` : ""}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CatalogResults;