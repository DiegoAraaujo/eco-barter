import "../../styles/availableProducts.css";
import CardProduct from "../ui/CardProduct";

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
        <CardProduct
          image={Item1}
          imageDescription="camisa masculina"
          productName="Jaqueta"
          location="Sobral-CE"
          productState="Estado de novo, nunca usada."
        />
        <CardProduct
          image={Item2}
          imageDescription="Escrivaninha simples"
          productName="Escrivaninha"
          location="Maracanaú-CE"
          productState="Na caixa ainda, nova."
        />
        <CardProduct
          image={Item3}
          imageDescription="alexa echo show 5"
          productName="Alexa echo show 5"
          location="Fortaleza-CE"
          productState="Semi-nova, pra vender logo."
        />
        <CardProduct
          image={Item4}
          imageDescription="Iphone 15"
          productName="Iphone 15"
          location="Ubajara-CE"
          productState="Com poucas marcas de uso."
        />
      </div>
    </section>
  );
}

export default AvailableProducts;
