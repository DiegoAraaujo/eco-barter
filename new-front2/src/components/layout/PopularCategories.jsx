// Caminho do arquivo: src/components/layout/PopularCategories.jsx
//
// Carrossel de categorias populares com dados por props (fallback: localStorage).
// - Props opcionais: `categories` = array de objetos com:
//     • { slug, label|name, count }  ou  { category, count } (label = category)
// - Se `categories` não vier, calcula a partir da tabela "items" (services/storage).
// - Mantém ícones, animações, setas, e acessibilidade.

import { useRef, useState, useEffect, useCallback, useMemo, useId } from "react";
import "../../styles/components/layout/PopularCategories.css";
import LovedCategoryCard from "../ui/LovedCategoryCard";
import { loadTable } from "../../services/storage";
import { CATEGORY_BY_SLUG, prettyCategory } from "../../constants/categories";

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

function PopularCategories({ categories: categoriesProp }) {
  const headingId = useId();
  const listId = `${headingId}-list`;
  const listaRef = useRef(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const prefersReduced = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false,
    []
  );

  // Mapa (por rótulo legível) → ícone
  const categoryIconMap = useMemo(
    () => ({
      Livros: BookIcon,
      Eletrodomésticos: HomeIcon,
      Roupas: ClothingIcon,
      Calçados: ShoeIcon,
      Móveis: ArmchairIcon,
      Esportes: SportIcon,
      Eletrônicos: ElectronicsIcon,
      Smartphones: SmartphoneIcon,
      Brinquedos: ToyIcon,
      Jardinagem: SproutIcon,
      Casa: HomeIcon,
      Informática: ElectronicsIcon,
      _default: HomeIcon,
    }),
    []
  );

  // Normaliza entrada (props OU fallback local)
  const categories = useMemo(() => {
    // 1) Se veio por props, normaliza:
    if (Array.isArray(categoriesProp) && categoriesProp.length) {
      return categoriesProp.map((c) => {
        // aceita { slug, label|name, count } ou { category, count }
        const slug = c.slug
          ?? Object.entries(CATEGORY_BY_SLUG).find(
              ([, meta]) => meta?.name?.toLowerCase() === String(c.name ?? c.label ?? c.category ?? "").toLowerCase()
            )?.[0]
          ?? String(c.name ?? c.label ?? c.category ?? "").toLowerCase();
        const label = c.label ?? c.name ?? c.category ?? prettyCategory(slug);
        return {
          category: label,
          slug,
          itemCount: Number(c.count) || 0,
          image: categoryIconMap[label] || categoryIconMap._default,
          imageDescription: `Ícone da categoria ${label}`,
          to: `/catalogo/${encodeURIComponent(slug)}`,
        };
      }).sort((a, b) => (b.itemCount - a.itemCount) || a.category.localeCompare(b.category, "pt-BR"));
    }

    // 2) Fallback: calcula a partir de "items" (localStorage)
    const items = loadTable("items"); // []
    const base = Object.entries(CATEGORY_BY_SLUG).reduce((acc, [slug, meta]) => {
      acc.set(slug, { label: meta?.name ?? prettyCategory(slug), slug, count: 0 });
      return acc;
    }, new Map());

    for (const it of items) {
      const slug = it?.categorySlug || "";
      const label = it?.category || "";
      if (slug && base.has(slug)) {
        base.get(slug).count += 1;
      } else if (label) {
        const pair = Object.entries(CATEGORY_BY_SLUG).find(
          ([, meta]) => meta?.name?.toLowerCase() === String(label).toLowerCase()
        );
        if (pair) base.get(pair[0]).count += 1;
      }
    }

    return Array.from(base.values())
      .sort((a, b) => (b.count - a.count) || a.label.localeCompare(b.label, "pt-BR"))
      .map(({ label, slug, count }) => ({
        category: label,
        slug,
        itemCount: count,
        image: categoryIconMap[label] || categoryIconMap._default,
        imageDescription: `Ícone da categoria ${label}`,
        to: `/catalogo/${encodeURIComponent(slug)}`,
      }));
  }, [categoriesProp, categoryIconMap]);

  const updateArrows = useCallback(() => {
    const el = listaRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

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

  const scrollF = (dir) => {
    const el = listaRef.current;
    if (!el) return;
    const step = calcStep();
    el.scrollBy({
      left: dir === "direita" ? step : -step,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

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
          {/* Botão esquerda */}
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

          {/* Botão direita */}
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

          {/* Lista rolável */}
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
              <div role="listitem" key={c.slug} className="pc-reveal">
                <LovedCategoryCard
                  category={c.category}
                  image={c.image}
                  imageDescription={c.imageDescription}
                  itemCount={c.itemCount}
                  to={c.to}
                />
              </div>
            ))}
          </div>

          {/* Gradientes laterais */}
          <div className={`edge-fade left ${canLeft ? "show" : ""}`} aria-hidden="true" />
          <div className={`edge-fade right ${canRight ? "show" : ""}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default PopularCategories;
