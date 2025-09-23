import { useRef } from "react";
import "../../styles/popularCategories.css";
import LovedCategoryCard from "../ui/LovedCategoryCard";

// imagens
import Baloon from "../../assets/category-icons/baloon.png";
import Hand from "../../assets/category-icons/hand.png";
import Category from "../../assets/category-icons/category.png";
import Confirmation from "../../assets/category-icons/confirmation.png";
import MagnifyingGlass from "../../assets/category-icons/magnifying-glass.png";
import ConnectExchange from "../../assets/category-icons/connect-exchange.png";
import NewCycle from "../../assets/category-icons/new-cycle.png";
import NextFind from "../../assets/category-icons/next-find.png";;
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
      <h2>Objetivos e metas!</h2>
      <div className="popular-categories-container">
        <div className="category-arrow-button" onClick={() => scrollF("esquerda")}>
          <img src={ArrowLeft} alt="Botão para mover para a esquerda" />
        </div>

        <div className="popular-categories-list" ref={listaRef}>
          <LovedCategoryCard category="Encontre a sua Próxima Troca!" image={MagnifyingGlass} imageDescription="ícone de uma lupa" />
          <LovedCategoryCard category="O que Você Busca Hoje?" image={Baloon} imageDescription="ícone de um balão" />
          <LovedCategoryCard category="Dê e Receba" image={Hand} imageDescription="ícone de uma mão e troca" />
          <LovedCategoryCard category="Navegue por Categorias" image={Category} imageDescription="ícone de categorias" />
          <LovedCategoryCard category="Ache o que Você Precisa" image={Confirmation} imageDescription="ícone de confirmação" />
          <LovedCategoryCard category="Dê um Novo Ciclo" image={NewCycle} imageDescription="ícone de novo ciclo" />
          <LovedCategoryCard category="O Próximo Achado Está Aqui" image={NextFind} imageDescription="ícone de próximo achado" />
          <LovedCategoryCard category="Conecte-se e Troque" image={ConnectExchange} imageDescription="ícone de conectar e trocar" />
        </div>

        <div className="category-arrow-button" onClick={() => scrollF("direita")}>
          <img src={ArrowRight} alt="Botão para mover para a direita" />
        </div>
      </div>
    </section>
  );
}

export default PopularCategories;
