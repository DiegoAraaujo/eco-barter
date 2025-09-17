import "../../styles/listProductCatalog.css";
import CardProduct from "../ui/CardProduct";
import ImgCamisa from "../../assets/image.svg";


function ListProductCatalog() {
  return (
    <>
      <CardProduct
        image={ImgCamisa}
        imageDescription="camisa masculina"
        productName="Jaqueta"
        location="Sobral-CE"
        productState="Estado de novo, nunca usada."
      />
    </>
  );
}

export default ListProductCatalog;