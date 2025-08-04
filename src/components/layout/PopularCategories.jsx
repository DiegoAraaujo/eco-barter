import { useRef } from "react";
import "../../styles/popularCategories.css";
import LovedCategoryCard from "../ui/LovedCategoryCard";

// imagens
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
import ArrowLeft from "../../assets/category-icons/arrow-left.svg";
import ArrowRight from "../../assets/category-icons/arrow-right.svg";

function PopularCategories() {
  const listaRef = useRef(null);

  function scrollF(direcao) {
    const container = listaRef.current;
    const distancia = 200;

    if (direcao === "direita") {
      container.scrollLeft += distancia;
    } else if (direcao === "esquerda") {
      container.scrollLeft -= distancia;
    }
  }

  return (
    <section className="popular-categories-section">
      <h2>Categorias mais amadas</h2>
      <div className="popular-categories-container">
        <div className="category-arrow-button desktop-arrow">
          <img
            src={ArrowLeft}
            alt="Botão para mover para a esquerda"
            onClick={() => scrollF("esquerda")}
          />
        </div>

        <div className="popular-categories-list" ref={listaRef}>
          <LovedCategoryCard
            category="Eletrônicos e Informática"
            image={ElectronicsIcon}
            imageDescription="ícone de um notebook"
          />
          <LovedCategoryCard
            category="Beleza e Cuidados Pessoais"
            image={BeautyIcon}
            imageDescription="ícone de beleza e cuidados"
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
            imageDescription="ícone de esporte e lazer"
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
            imageDescription="ícone de um carro"
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

        <div className="category-arrow-button">
          <img
            src={ArrowLeft}
            alt="Botão para mover para a esquerda"
            className="mobile-arrow"
            onClick={() => scrollF("esquerda")}
          />
          <img
            src={ArrowRight}
            alt="Botão para mover para a direita"
            onClick={() => scrollF("direita")}
          />
        </div>
      </div>
    </section>
  );
}

export default PopularCategories;
