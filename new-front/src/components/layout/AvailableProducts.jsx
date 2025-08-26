// Caminho do arquivo: src/components/layout/AvailableProducts.jsx

// Este componente mostra uma seção de produtos disponíveis para troca.
// - Permite filtrar por categoria (slug ou nome).
// - Pode receber uma lista de itens por prop ou buscar dos mocks (items.js).
// - Ordena os itens por data de criação (mais recentes primeiro).
// - Limita a quantidade de itens mostrados (prop limit).
// - Exibe botão "Ver mais" se houver mais itens que o limite.
// - Usa IntersectionObserver para animar cards ao entrar na viewport.
// - Totalmente acessível com ARIA (aria-label, aria-describedby, region, etc.).

import { useEffect, useMemo, useRef, useId } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/layout/AvailableProducts.css";
import CardProduct from "../ui/CardProduct";
import Container from "../ui/Container";
import {
  getAllItems,
  getItemsByCategory,
  prettyCategory,
  CATEGORY_BY_SLUG,
  categoryData,
} from "../../mocks/items";

function AvailableProducts({
  title = "🛒 Itens disponíveis para troca",
  category,               // categoria em slug ("livros") ou rótulo ("Livros")
  limit,                  // número máximo de itens a exibir
  items,                  // opcional: se não vier, busca dos mocks
  showMoreTo,             // rota para o botão "ver mais"
  showMoreLabel = "Ver mais itens",
  containerSize = "lg",   // tamanho do container (sm, md, lg)
  bleed = false,          // se o container deve "sangrar" nas laterais
  tone = "brand",         // cor de fundo: "brand" | "light"
  sideGap,
  headingTag = "h2",      // tag do título (h2 por padrão)
  renderHeading = true,   // exibir ou não o título
  ariaLabelledby,         // id alternativo para acessibilidade
}) {
  const sectionRef = useRef(null);
  const internalHeadingId = useId();

  // Normaliza categoria → slug (ex: "Livros" → "livros")
  const catSlug = useMemo(() => {
    if (!category) return undefined;
    const raw = String(category).trim();
    if (CATEGORY_BY_SLUG[raw]) return raw; // já é slug conhecido
    const found = Object.entries(categoryData)
      .find(([name]) => name.toLowerCase() === raw.toLowerCase());
    return found?.[1].slug ?? raw.toLowerCase();
  }, [category]);

  // Nome legível da categoria (para exibição)
  const catLabel = useMemo(() => {
    if (!catSlug) return undefined;
    return CATEGORY_BY_SLUG[catSlug]?.name ?? prettyCategory(catSlug);
  }, [catSlug]);

  // Fonte de dados → prop "items" tem prioridade; senão busca mocks
  const sourceItems = useMemo(() => {
    if (Array.isArray(items)) return items;
    return catSlug ? getItemsByCategory(catSlug) : getAllItems();
  }, [items, catSlug]);

  // Função auxiliar: converte datas/tempos para ordenação
  const parseTime = (v) => {
    if (!v) return 0;
    const t = new Date(v).getTime();
    return Number.isFinite(t) ? t : (typeof v === "number" ? v : 0);
  };

  // Lista final de itens (ordenados e limitados)
  const { list, total } = useMemo(() => {
    const sorted = [...sourceItems].sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt));
    const lim = Number.isFinite(limit) ? limit : undefined;
    const sliced = lim ? sorted.slice(0, lim) : sorted;
    return { list: sliced, total: sourceItems.length };
  }, [sourceItems, limit]);

  const hasMore = Number.isFinite(limit) && total > list.length;

  // Define rota do botão "Ver mais"
  const moreHref = useMemo(() => {
    if (showMoreTo) return showMoreTo;
    return catSlug ? `/catalogo/${encodeURIComponent(catSlug)}` : `/catalogo`;
  }, [showMoreTo, catSlug]);

  // Efeito: revela os cards com classe CSS ao entrar na viewport
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const targets = root.querySelectorAll(".reveal-in");

    // Se usuário prefere menos animações ou browser não suporta → mostra direto
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Observa elementos e adiciona classe quando entram na tela
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

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list.length]);

  // Definições de acessibilidade e estilo
  const HeadingTag = headingTag;
  const effectiveLabelId = ariaLabelledby ?? (renderHeading ? internalHeadingId : undefined);
  const resultsId = `${(effectiveLabelId || internalHeadingId)}-results`;
  const toneClass = tone === "light" ? "is-light" : "";
  const sectionStyle = sideGap ? { ["--products-side-gap"]: sideGap } : undefined;

  return (
    <section
      ref={sectionRef}
      className={`products-section ${toneClass}`}
      role="region"
      aria-labelledby={effectiveLabelId}
      aria-describedby={resultsId}
      aria-label={!effectiveLabelId ? title : undefined}
      style={sectionStyle}
      data-total={total}
      data-category={catSlug || ""}
    >
      <Container size={containerSize} bleed={bleed} className="products-inner">
        {/* Título da seção */}
        {renderHeading && (
          <HeadingTag id={internalHeadingId} className="products-heading">
            {title}
          </HeadingTag>
        )}

        {/* Texto oculto para leitores de tela */}
        <p id={resultsId} className="visually-hidden">
          Mostrando {list.length} de {total} {total === 1 ? "item" : "itens"}
          {catLabel ? ` na categoria ${catLabel}` : ""}.
        </p>

        {/* Subtítulo com a categoria */}
        {catLabel && (
          <p className="products-subtitle">
            Filtrando por: <strong>{catLabel}</strong>
          </p>
        )}

        {/* Lista de produtos ou mensagem de vazio */}
        {list.length > 0 ? (
          <>
            <div
              className="products-list"
              role="list"
              aria-live="polite"
              aria-describedby={resultsId}
            >
              {list.map((item) => (
                <div role="listitem" key={item.id} className="product-slot reveal-in">
                  <CardProduct
                    id={item.id}
                    title={item.title}
                    category={item.category}
                    city={item.city}
                    image={item.image}
                    condition={item.condition}
                  />
                </div>
              ))}
            </div>

            {/* Botão "Ver mais" se houver mais itens */}
            {hasMore && (
              <div className="products-footer reveal-in is-visible">
                <Link to={moreHref} className="hero-style-button" aria-label={showMoreLabel}>
                  {showMoreLabel}
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="products-empty" role="status" aria-live="polite">
            Nenhum item disponível{catLabel ? ` em “${catLabel}”` : ""} no momento.
          </div>
        )}
      </Container>
    </section>
  );
}

export default AvailableProducts;
