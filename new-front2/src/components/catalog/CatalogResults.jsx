// Caminho do arquivo: src/components/catalog/CatalogResults.jsx
import CardProduct from "../ui/CardProduct";
import "../../styles/components/catalog/CatalogResults.css";

function CatalogResults({ items = [], category, myItems = [] }) {
  const count = items.length;
  const titleText = category ? `Categoria: ${category}` : "Todos os Itens";
  const headingId = "catalog-results-title";

  return (
    <section className="catalog-results" role="region" aria-labelledby={headingId}>
      {/* Cabeçalho com título e quantidade de resultados */}
      <header className="results-header">
        <h2 id={headingId} className="results-title">{titleText}</h2>
        <p className="results-count" aria-live="polite">
          {count} {count === 1 ? "item encontrado" : "itens encontrados"}
        </p>
      </header>

      {/* Grid com os resultados */}
      <div className="results-grid" role="list">
        {count > 0 ? (
          items.map((item, idx) => {
            const safeId = item?.id ?? `no-id-${idx}`;
            const owner = item?.owner != null ? item.owner : undefined;

            return (
              <div role="listitem" key={safeId} className="results-slot">
                <CardProduct
                  id={safeId}
                  owner={owner}                // bloqueia proposta ao próprio item (quando disponível)
                  image={item?.image}
                  imageDescription={item?.imageDescription}
                  title={item?.title}
                  category={item?.category}
                  city={item?.city}
                  condition={item?.condition}
                  myItems={myItems}            // itens do usuário logado para propor troca
                />
              </div>
            );
          })
        ) : (
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
