import "../styles/catalogPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CardProduct from "../components/ui/CardProduct";
import ListFilterCatalog from "../components/layout/ListFilterCatalog";
import { catalog as catalog_mock } from "../data/catalog";
import { useEffect, useState } from "react";

function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas as categorias");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setCatalog(catalog_mock);

      const extractedItems = catalog_mock.flatMap(user => user.items);
      setAllItems(extractedItems);
      setFilteredItems(extractedItems);

      setLoading(false);
    }, 2000);
  }, []);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);

    if (category === "Todas as categorias") {
      setFilteredItems(allItems);
    } else {
      const filtered = allItems.filter(item => item.category === category);
      setFilteredItems(filtered);
    }
  };

  return (
    <>
      <div className="page">
        <Header />

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
                    : selectedCategory
                  }
                </h1>

                <p>{filteredItems.length} itens encontrados</p>
              </header>

              <div className="productListMain">
                {loading ? (
                  <h3>Carregando catálogo...</h3>
                ) : filteredItems.length === 0 ? (
                  <h3>Nenhum item encontrado nesta categoria</h3>
                ) : (
                  filteredItems.map((item) => (
                    <CardProduct
                      key={item.id}
                      id={item.id}
                      imageUrl={item.imageUrl}
                      nameProduct={item.nameProduct || item.name}
                      location={item.location}
                      itemCondition={item.itemCondition}
                    />
                  ))
                )}
              </div>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default CatalogPage;
