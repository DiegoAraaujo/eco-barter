import "../../styles/cardProduct.css";

import BiggerButton from "../ui/BiggerButton";
import SmallerButton from "../ui/SmallerButton";

function cardProduct({
  image,
  imageDescription,
  productName,
  location,
  productState,
}) {
  return (
    <div className="card-product">
      <div className="product-image">
        <img src={image} alt={imageDescription} />
      </div>
      <div className="product-information">
        <p className="productName">{productName}</p>
        <p className="locationProduct">{location}</p>
        <p className="productState">{productState}</p>
      </div>
      <div className="product-actions">
        <SmallerButton buttonMenssage="Ver Detalhes" />
        <SmallerButton buttonMenssage="Propor troca" />
      </div>
    </div>
  );
}

export default cardProduct;
