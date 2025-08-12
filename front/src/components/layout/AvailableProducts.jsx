import "../../styles/availableProducts.css";
import CardProduct from "../ui/CardProduct";
import ItemPreview from "./ItemPreview";

// imagem dos produtos
import Item1 from "../../assets/item1.svg";
import Item2 from "../../assets/item2.svg";
import Item3 from "../../assets/item3.svg";
import Item4 from "../../assets/item4.svg";
function AvailableProducts() {
  return (
    <section className="products-section">
      <h2>Itens disponíveis para troca</h2>

      <div className="Products-list">
        <ItemPreview />
      </div>
    </section>
  );
}

export default AvailableProducts;
