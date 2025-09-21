import "../../styles/cardMyProduct.css";

//import BiggerButton from "../ui/BiggerButton";
//import SmallerButton from "../ui/SmallerButton";

function CardMyProduct({
  imageUrl,
  imageDescription,
  productName,
  children,
  category,
  productState,
}) {
  return (
    <div className="card-my-product">
      <div className="my-product-image">
        <img src={imageUrl} alt={imageDescription} />
      </div>
      <div className="my-product-information">
        <p className="my-productName">{productName}</p>
        <p className="my-productCategory">Categoria: {category}</p>
       
       
        <p className="productState">Status: {productState}</p>
         {children}
      </div>
      
    </div>
  );
}

export default CardMyProduct;