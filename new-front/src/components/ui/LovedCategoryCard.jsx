// Caminho do arquivo: src/components/ui/LovedCategoryCard.jsx

// Este componente renderiza um card visual para uma categoria.
// - Mostra ícone, nome da categoria e número de itens.
// - Pode ser usado como link para o catálogo filtrado por categoria.
// - Suporta estados: selecionado, desabilitado.
// - Fornece rótulos acessíveis (aria-label) com nome e quantidade de itens.
// - Responsável por exibição simples, reutilizado no carrossel de categorias.

import { Link } from "react-router-dom";
import "../../styles/components/ui/LovedCategoryCard.css";

function LovedCategoryCard({
  category,          // nome da categoria
  image,             // ícone da categoria
  imageDescription,  // descrição acessível do ícone
  itemCount,         // número de itens disponíveis
  onClick,
  selected = false,  // estado de seleção
  disabled = false,  // estado de desabilitado
  className = "",
  ...props
}) {
  // Classes condicionais
  const classes = [
    "loved-category-card",
    selected && "loved-category-card--selected",
    disabled && "loved-category-card--disabled",
    className
  ].filter(Boolean).join(" ");

  // URL do catálogo filtrado pela categoria
  const catalogUrl = `/catalogo?categoria=${encodeURIComponent(category)}`;

  // Texto acessível para leitores de tela
  const getAriaLabel = () => {
    let label = `Categoria ${category}`;
    if (itemCount !== undefined) {
      label += `, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`;
    }
    return label;
  };

  // Conteúdo visual do card
  const content = (
    <>
      <span className="loved-category-card__icon" aria-hidden="true">
        <img
          src={image}
          alt={imageDescription}
          loading="lazy"
          decoding="async"
          width="40"
          height="40"
        />
      </span>

      <span className="loved-category-card__name">{category}</span>

      {/* Informações extras: número de itens */}
      <div className="loved-category-card__info">
        {itemCount !== undefined && (
          <span className="loved-category-card__count">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </span>
        )}
      </div>
    </>
  );

  // Se não está desabilitado, renderiza como link para o catálogo
  if (!disabled) {
    return (
      <Link
        to={catalogUrl}
        className={classes}
        aria-label={getAriaLabel()}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Se desabilitado, renderiza como <span> com aria-disabled
  return (
    <span
      className={classes}
      aria-disabled="true"
      aria-label={getAriaLabel()}
      {...props}
    >
      {content}
    </span>
  );
}

export default LovedCategoryCard;
