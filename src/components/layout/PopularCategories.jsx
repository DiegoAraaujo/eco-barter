import "../../styles/popularCategories.css";
import LovedCategoryCard from "../ui/LovedCategoryCard";

// imagens para cada categoria
import Shirt from "../../assets/clothesIcon.svg";


function PopularCategories() {
  return (
    <section className="popular-categories-section">
      <h2>Categorias mais amadas</h2>
      <div className="popular-categories-list">
        <LovedCategoryCard
          category="eletronicos"
          image={Shirt}
          imageDescription="icon of a shirt"
        />
        <LovedCategoryCard
          category="eletronicos"
          image={Shirt}
          imageDescription="icon of a shirt"
        />
        <LovedCategoryCard
          category="eletronicos"
          image={Shirt}
          imageDescription="icon of a shirt"
        />
        <LovedCategoryCard
          category="eletronicos"
          image={Shirt}
          imageDescription="icon of a shirt"
        />
        <LovedCategoryCard
          category="eletronicos"
          image={Shirt}
          imageDescription="icon of a shirt"
        />
        <LovedCategoryCard
          category="eletronicos"
          image={Shirt}
          imageDescription="icon of a shirt"
        />
      </div>
    </section>
  );
}

export default PopularCategories;
