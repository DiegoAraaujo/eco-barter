// Caminho do arquivo: src/components/layout/AvailableProducts.jsx
//
// Seção de itens disponíveis (sem mocks):
// - Se receber `items` por prop, usa-os.
// - Caso contrário, busca via services/items (NO-OP por enquanto).
// - Normaliza categoria a partir de slug ou rótulo (CATEGORY_BY_SLUG / prettyCategory).
// - Ordena por createdAt desc e limita pelo `limit`.
// - Passa `owner` e `myItems` para o CardProduct (sem dependência de mocks).

import { useEffect, useMemo, useRef, useId, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/components/layout/AvailableProducts.css";
import CardProduct from "../ui/CardProduct";
import Container from "../ui/Container";
import { CATEGORY_BY_SLUG, prettyCategory } from "../../constants/categories";
import { listItems } from "../../services/items"; // <- NO-OP até o backend

function AvailableProducts({
  title = "🛒 Itens disponíveis para troca",
  category,               // slug ("livros") ou rótulo ("Livros")
  limit,                  // número máximo de itens a exibir
  items,                  // opcional: se vier, não busca
  myItems = [],           // itens do usuário logado [{id, title}] para propor troca
  showMoreTo,             // rota para o botão "ver mais"
  showMoreLabel = "Ver mais itens",
  containerSize = "lg",
  bleed = false,
  tone = "brand",
  sideGap,
  headingTag = "h2",
  renderHeading = true,
  ariaLabelledby,
}) {
  const sectionRef = useRef(null);
  const internalHeadingId = useId();

  // Normaliza categoria → slug (ex.: "Livros" → "livros")
  const catSlug = useMemo(() => {
    if (!category) return undefined;
    const raw = String(category).trim();

    // já é slug conhecido
    if (CATEGORY_BY_SLUG[raw]) return raw;

    // tenta achar por rótulo (name), case-insensitive
    const entry = Object.entries(CATEGORY_BY_SLUG)
      .find(([, meta]) => meta?.name?.toLowerCase() === raw.toLowerCase());
    return entry?.[0] || raw.toLowerCase();
  }, [category]);

  // Rótulo legível
  const catLabel = useMemo(() => (catSlug ? (CATEGORY_BY_SLUG[catSlug]?.name ?? prettyCategory(catSlug)) : undefined), [catSlug]);

  // Fonte: se `items` não veio, buscamos via serviço
  const [fetched, setFetched] = useState([]);
  const shouldFetch = !Array.isArray(items);

  useEffect(() => {
    if (!shouldFetch) return;
    let alive = true;

    listItems({ page: 1, perPage: 50, category: catSlug })
      .then((res) => {
        if (!alive) return;
        const arr = Array.isArray(res) ? res : (res?.items || []);
        setFetched(arr);
      })
      .catch(() => {
        if (!alive) return;
        setFetched([]); // mantém UI viva
      });

    return () => { alive = false; };
  }, [shouldFetch, catSlug]);

  const sourceItems = useMemo(() => (Array.isArray(items) ? items : fetched), [items, fetched]);

  // Ordenação por createdAt desc + limite
  const parseTime = (v) => {
    if (!v) return 0;
    const t = new Date(v).getTime();
    return Number.isFinite(t) ? t : (typeof v === "number" ? v : 0);
  };

  const { list, total } = useMemo(() => {
    const sorted = [...sourceItems].sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt));
    const lim = Number.isFinite(limit) ? limit : undefined;
    const sliced = lim ? sorted.slice(0, lim) : sorted;
    return { list: sliced, total: sourceItems.length };
  }, [sourceItems, limit]);

  const hasMore = Number.isFinite(limit) && total > list.length;

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

    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
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

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list.length]);

  // A11y e estilo
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
        {/* Título */}
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

        {/* Lista ou vazio */}
        {list.length > 0 ? (
          <>
            <div
              className="products-list"
              role="list"
              aria-live="polite"
              aria-describedby={resultsId}
            >
              {list.map((item, idx) => {
                const safeId = item?.id ?? `no-id-${idx}`;
                return (
                  <div role="listitem" key={safeId} className="product-slot reveal-in">
                    <CardProduct
                      id={safeId}
                      owner={item?.owner}              // <- importante para bloquear proposta ao próprio item
                      title={item?.title}
                      category={item?.category}
                      city={item?.city}
                      image={item?.image}
                      imageDescription={item?.imageDescription}
                      condition={item?.condition}
                      myItems={myItems}                // <- itens do usuário logado
                    />
                  </div>
                );
              })}
            </div>

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
