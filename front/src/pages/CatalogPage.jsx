import "../styles/catalogPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CardProduct from "../components/ui/CardProduct";
import ImgCamisa from "../assets/image.svg";
import ListFilterCatalog from "../components/layout/ListFilterCatalog";
import ListProductCatalog from "../components/layout/ListProductCatalog";

function CatalogPage() {
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
                <ListFilterCatalog />
              </div>
            </aside>
            <main className="catalogMain">
              <header className="headerMain">
                <h1>Todos os Itens</h1>
                <p>3 itens encontrados</p>
              </header>
              <div className="productListMain">
                <ListProductCatalog />
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