import "../styles/catalogPage.css";
import CardProduct from "../components/ui/CardProduct";
import ListFilterCatalog from "../components/layout/ListFilterCatalog";
import { useEffect, useState } from "react";
import axios from "axios";

function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    "Todas as categorias"
  );

  const fetchItems = async (category) => {
    try {
      setLoading(true);

      const query =
        category && category !== "Todas as categorias"
          ? `?category=${category}`
          : "";
      const res = await axios.get(`http://localhost:3000/item/catalog${query}`);
      console.log(res.data);
      setCatalog(res.data);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
      setCatalog([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory]);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="page">
      <div className="pageCatalog">
        <div className="catalogContainer">
          <aside className="catalogFilters">
            <header className="headerFilter">
              <h1>Categorias</h1>
            </header>
            <div className="categoryCatalog">
              <ListFilterCatalog
                onFilterChange={handleFilterChange}
                selectedCategory={selectedCategory}
              />
            </div>
          </aside>

          <main className="catalogMain">
            <header className="headerMain">
              <h1>
                {selectedCategory === "Todas as categorias"
                  ? "Todos os Itens"
                  : selectedCategory}
              </h1>
              <p>{catalog.length} itens encontrados</p>
            </header>

            <div className="productListMain">
              {loading ? (
                <h3>Carregando catálogo...</h3>
              ) : catalog.length === 0 ? (
                <h3>Nenhum item encontrado nesta categoria</h3>
              ) : (
                catalog.map((item) => (
                  <CardProduct
                    key={item.id}
                    id={item.id}
                    imageUrl={item.imageUrl}
                    nameProduct={item.name}
                    location={item.account.city}
                    itemCondition={item.condition}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default CatalogPage;
