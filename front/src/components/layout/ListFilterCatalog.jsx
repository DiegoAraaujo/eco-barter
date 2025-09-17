import "../../styles/listFilterCatalog.css";

function ListFilterCatalog({ onFilterChange, selectedCategory }) {
  const categories = [
    "Todas as categorias",
    "Eletrodomésticos",
    "Calçado",
    "Brinquedos",
    "Celulares",
    "Roupas"
  ];

  return (
    <>
      <main className="mainListFilter">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onFilterChange(category)}
          >
            {category}
          </button>
        ))}
      </main> 
    </>
  );
}

export default ListFilterCatalog;