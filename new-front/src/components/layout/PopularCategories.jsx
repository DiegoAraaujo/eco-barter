// Caminho do arquivo: src/components/layout/PopularCategories.jsx

// Este componente exibe um carrossel horizontal com as categorias mais populares.
// - Mostra cards com ícone, nome e contagem de itens de cada categoria.
// - Ícones são mapeados conforme o nome da categoria (fallback para padrão).
// - Implementa rolagem com setas, teclado e arraste suave.
// - Monitora scroll/resize para ativar/desativar setas.
// - Usa IntersectionObserver para animar entrada dos cards (reveal).
// - Respeita preferências de acessibilidade (prefers-reduced-motion).
// - Fornece suporte ARIA para rolagem/carrossel acessível.

import { useRef, useState, useEffect, useCallback, useMemo, useId } from "react";
import "../../styles/components/layout/PopularCategories.css";
import LovedCategoryCard from "../ui/LovedCategoryCard";
import { getCategoriesWithCount } from "../../mocks/items";

// Ícones de categorias
import ClothingIcon from "../../assets/icons/category/clothing-icon.svg";
import ShoeIcon from "../../assets/icons/category/shoe-icon.svg";
import ToyIcon from "../../assets/icons/category/toy-icon.svg";
import SproutIcon from "../../assets/icons/category/sprout-icon.svg";
import SportIcon from "../../assets/icons/category/sport-icon.svg";
import HomeIcon from "../../assets/icons/category/home-icon.svg";
import ElectronicsIcon from "../../assets/icons/category/electronics-icon.svg";
import ArmchairIcon from "../../assets/icons/category/armchair-icon.svg";
import SmartphoneIcon from "../../assets/icons/category/smartphone-icon.svg";
import BookIcon from "../../assets/icons/category/book-icon.svg";

// Ícones de navegação
import ArrowLeft from "../../assets/icons/ui/arrow-left.svg";
import ArrowRight from "../../assets/icons/ui/arrow-right.svg";

function PopularCategories() {
  const headingId = useId();
  const listId = `${headingId}-list`;
  const listaRef = useRef(null);

  // Estado para controlar se pode rolar para esquerda/direita
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Detecta preferência de movimento reduzido
  const prefersReduced = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
    []
  );

  // Mapeia categorias para ícones correspondentes
  const categoryIconMap = useMemo(
    () => ({
      Livros: BookIcon,
      Eletrodomésticos: HomeIcon,
      Roupas: ClothingIcon,
      Calçados: ShoeIcon,
      Móveis: ArmchairIcon,
      Esportes: SportIcon,
      Informática: ElectronicsIcon,
      Celulares: SmartphoneIcon,
      Brinquedos: ToyIcon,
      Jardinagem: SproutIcon,
      _default: HomeIcon,
    }),
    []
  );

  // Monta lista de categorias com ícone, descrição e contagem
  const categories = useMemo(() => {
    const categoriesWithCount = getCategoriesWithCount();
    return categoriesWithCount.map(({ category, count }) => ({
      category,
      itemCount: count,
      image: categoryIconMap[category] || categoryIconMap._default,
      imageDescription: `Ícone da categoria ${category}`
    }));
  }, [categoryIconMap]);

  // Atualiza estado das setas conforme posição do scroll
  const updateArrows = useCallback(() => {
    const el = listaRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  // Monitora scroll/resize/resizeObserver para atualizar setas
  useEffect(() => {
    const el = listaRef.current;
    if (!el) return;
    updateArrows();

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);

    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  // Animação de entrada (reveal-in)
  useEffect(() => {
    const root = listaRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".pc-reveal");

    if (prefersReduced) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [categories.length, prefersReduced]);

  // Calcula passo de scroll (largura de um card + gap)
  const calcStep = () => {
    const el = listaRef.current;
    if (!el) return 240;
    const first = el.querySelector('[role="listitem"]');
    if (!first) return Math.max(240, Math.round(el.clientWidth * 0.8));
    const rect = first.getBoundingClientRect();
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return Math.max(rect.width + gap, Math.round(el.clientWidth * 0.8));
  };

  // Executa scroll horizontal (esquerda/direita)
  const scrollF = (dir) => {
    const el = listaRef.current;
    if (!el) return;
    const step = calcStep();
    el.scrollBy({
      left: dir === "direita" ? step : -step,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  // Acessibilidade: navegação por teclado
  const onKeyDownList = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollF("direita");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollF("esquerda");
    } else if (e.key === "Home") {
      e.preventDefault();
      listaRef.current?.scrollTo({
        left: 0,
        behavior: prefersReduced ? "auto" : "smooth"
      });
    } else if (e.key === "End") {
      e.preventDefault();
      const el = listaRef.current;
      el?.scrollTo({
        left: el.scrollWidth,
        behavior: prefersReduced ? "auto" : "smooth"
      });
    }
  };

  const resultsId = `${headingId}-results`;

  return (
    <section className="popular-categories-section" aria-labelledby={headingId}>
      <div className="container">
        <h2 id={headingId}>Categorias mais amadas</h2>
        <p id={resultsId} className="visually-hidden">
          {categories.length} categorias listadas.
        </p>

        <div className="popular-categories-container">
          {/* Botão para rolar à esquerda */}
          <button
            type="button"
            className="category-arrow left"
            onClick={() => scrollF("esquerda")}
            aria-label="Mover lista para a esquerda"
            aria-controls={listId}
            aria-disabled={!canLeft}
            disabled={!canLeft}
          >
            <img src={ArrowLeft} alt="" aria-hidden="true" />
          </button>

          {/* Botão para rolar à direita */}
          <button
            type="button"
            className="category-arrow right"
            onClick={() => scrollF("direita")}
            aria-label="Mover lista para a direita"
            aria-controls={listId}
            aria-disabled={!canRight}
            disabled={!canRight}
          >
            <img src={ArrowRight} alt="" aria-hidden="true" />
          </button>

          {/* Lista rolável de categorias */}
          <div
            id={listId}
            className="popular-categories-list"
            ref={listaRef}
            role="list"
            aria-describedby={resultsId}
            aria-roledescription="carrossel"
            aria-label="Lista de categorias populares (rolagem horizontal)"
            tabIndex={0}
            onKeyDown={onKeyDownList}
          >
            {categories.map((c) => (
              <div role="listitem" key={c.category} className="pc-reveal">
                <LovedCategoryCard
                  category={c.category}
                  image={c.image}
                  imageDescription={c.imageDescription}
                  itemCount={c.itemCount}
                  to={`/catalogo?categoria=${encodeURIComponent(c.category)}`}
                />
              </div>
            ))}
          </div>

          {/* Gradientes nas bordas para indicar overflow */}
          <div className={`edge-fade left ${canLeft ? "show" : ""}`} aria-hidden="true" />
          <div className={`edge-fade right ${canRight ? "show" : ""}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default PopularCategories;
