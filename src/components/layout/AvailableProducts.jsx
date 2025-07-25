import "../../styles/availableProducts.css";
import CardProduct from "../ui/CardProduct";

// imagem dos produtos
import ImgCamisa from "../../assets/image.svg";
function AvailableProducts() {
  return (
    <section className="products-section">
      <h2>Itens disponíveis para troca</h2>

      <div className="Products-list">
        <CardProduct
          image={ImgCamisa}
          imageDescription="camisa masculina"
          productName="Jaqueta"
          location="Sobral-CE"
          productState="Estado de novo, nunca usada."
        />
        <CardProduct
          image={ImgCamisa}
          imageDescription="camisa masculina"
          productName="Jaqueta"
          location="Sobral-CE"
          productState="Estado de novo, nunca usada."
        />
        <CardProduct
          image={ImgCamisa}
          imageDescription="camisa masculina"
          productName="Jaqueta"
          location="Sobral-CE"
          productState="Estado de novo, nunca usada."
        />
        <CardProduct
          image={ImgCamisa}
          imageDescription="camisa masculina"
          productName="Jaqueta"
          location="Sobral-CE"
          productState="Estado de novo, nunca usada."
        />
      </div>
    </section>
  );
}

export default AvailableProducts;
