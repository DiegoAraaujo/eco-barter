import "../../styles/listFilterCatalog.css";

function ListFilterCatalog({ onFilterChange, selectedCategory }) {
  const categories = [
    { front: "Todas as categorias", toBack: "Todas as categorias" },
    { front: "Brinquedos", toBack: "BRINQUEDOS" },
    { front: "Calçados", toBack: "CALCADOS" },
    { front: "Celulares", toBack: "CELULARES" },
    { front: "Eletrodomesticos", toBack: "ELETRODOMESTICOS" },
    { front: "Esportes", toBack: "ESPORTES" },
    { front: "Informatica", toBack: "INFORMATICA" },
    { front: "Jardinagem", toBack: "JARDINAGEM" },
    { front: "Livros", toBack: "LIVROS" },
    { front: "Moveis", toBack: "MOVEIS" },
    { front: "Roupas", toBack: "ROUPAS" },
  ];

  return (
    <>
      <main className="mainListFilter">
        {categories.map((category, index) => (
          <button
            style={{ fontSize: "10px" }}
            key={index}
            className={`filter ${
              selectedCategory === category.toBack ? "active" : ""
            }`}
            onClick={() => onFilterChange(category.toBack)}
          >
            {category.front}
          </button>
        ))}
      </main>
    </>
  );
}

export default ListFilterCatalog;
