import "../../styles/cardProduct.css";
import { Link } from "react-router-dom";

import BiggerButton from "../ui/BiggerButton";
import SmallerButton from "../ui/SmallerButton";

function cardProduct({
  id,
  imageUrl,
  nameProduct,
  location,
  itemCondition,
}) {
  return (
    <div className="card-product">
      <div className="product-image">
        <img src={imageUrl} alt={nameProduct} />
      </div>
      <div className="product-information">
        <p className="productName">{nameProduct}</p>
        <p className="locationProduct">{location}</p>
        <p className="productState">{itemCondition}</p>
      </div>
      <div className="product-actions">
        <Link className="linkProduct" to={`/item/${id}`}>
          <SmallerButton buttonMessage="Ver Detalhes" />
        </Link>
        <SmallerButton buttonMessage="Propor troca" />
      </div>
    </div>
  );
}

export default cardProduct;
