import "../../styles/popularCategories.css";
import LovedCategoryCard from "../ui/LovedCategoryCard";

// imagens para cada categoria
import ClothingIcon from "../../assets/category-icons/clothing-icon.svg";
import VehicleIcon from "../../assets/category-icons/vehicle-icon.svg";
import ToyIcon from "../../assets/category-icons/toy-icon.svg";
import ToolIcon from "../../assets/category-icons/tool-icon.svg";
import SportIcon from "../../assets/category-icons/sport-icon.svg";
import HomeIcon from "../../assets/category-icons/home-icon.svg";
import ElectronicsIcon from "../../assets/category-icons/electronics-icon.svg";
import BeautyIcon from "../../assets/category-icons/beauty-icon.svg";
import AnimalIcon from "../../assets/category-icons/animal-icon.svg";
import BookIcon from "../../assets/category-icons/book-icon.svg";


function PopularCategories() {
  return (
    <section className="popular-categories-section">
      <h2>Categorias mais amadas</h2>
      <div className="popular-categories-list">
        <LovedCategoryCard
          category="Eletrônicos e Informática"
          image={ElectronicsIcon}
          imageDescription="ícone de um notebook"
        />
        <LovedCategoryCard
          category="Beleza e Cuidados Pessoais"
          image={BeautyIcon}
          imageDescription="ícone que representa  beleza e cuidados pessoais"
        />
        <LovedCategoryCard
          category="Casa e Utilidades"
          image={HomeIcon}
          imageDescription="ícone de uma casa"
        />
        <LovedCategoryCard
          category="Animais"
          image={AnimalIcon}
          imageDescription="ícone de um animal"
        />
        <LovedCategoryCard
          category="Esportes e Lazer"
          image={SportIcon}
          imageDescription="ícone para representar esporte e lazer"
        />
        <LovedCategoryCard
          category="Ferramentas"
          image={ToolIcon}
          imageDescription="ícone de uma chave de fenda"
        />
        <LovedCategoryCard
          category="Brinquedos"
          image={ToyIcon}
          imageDescription="ícone de um brinquedo"
        />
        <LovedCategoryCard
          category="Veículos"
          image={VehicleIcon}
          imageDescription="ícone de um veículo(carro)"
        />
        <LovedCategoryCard
          category="Vestuário"
          image={ClothingIcon}
          imageDescription="ícone de uma camisa"
        />
        <LovedCategoryCard
          category="Livros"
          image={BookIcon}
          imageDescription="ícone de um livro"
        />
      </div>
    </section>
  );
}

export default PopularCategories;
