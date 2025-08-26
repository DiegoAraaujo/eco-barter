// Caminho do arquivo: src/components/ui/CardProduct.jsx
// Este componente representa um "card" individual de produto no catálogo.
// - Mostra imagem, título, categoria, cidade e condição do item.
// - Lida com carregamento e erro de imagem (placeholder quando necessário).
// - Oferece ações: "Ver Detalhes" e "Propor Troca" (se permitido).
// - Controla modal de proposta de troca (ProposeTradeModal).
// - Verifica se o item pertence ao usuário logado e só permite propor troca se não for dele.

import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import "../../styles/components/ui/CardProduct.css";
import placeholderImg from "../../assets/img/placeholder.png";

import ProposeTradeModal from "../trade/ProposeTradeModal";
import { getAllItems, getItemById } from "../../mocks/items";
import { useAuth } from "../../context/AuthContext";

function CardProduct({
  id,
  image,
  imageDescription,
  title,
  category,
  city,
  condition,
  fallbackImage = placeholderImg, // imagem padrão se não carregar
}) {
  const titleId = `product-title-${id}`;
  const [imgError, setImgError] = useState(false);   // erro no carregamento da imagem
  const [isLoading, setIsLoading] = useState(true);  // controle de loading da imagem
  const [openTrade, setOpenTrade] = useState(false); // estado do modal de troca

  const { user, isAuthenticated } = useAuth();
  const userId = user?.id ? String(user.id) : null;

  // Handlers para carregamento/erro da imagem
  const handleLoad = () => setIsLoading(false);
  const handleError = () => { setIsLoading(false); setImgError(true); };

  // Dono do item atual (para saber se é do usuário logado)
  const itemOwnerId = useMemo(() => String(getItemById(id)?.owner ?? ""), [id]);
  const isMine = userId && itemOwnerId === userId;

  // Lista de itens do usuário logado → usados para propor trocas
  const myItems = useMemo(() => {
    if (!userId) return [];
    return getAllItems()
      .filter((i) => String(i.owner) === userId)
      .map((i) => ({ id: i.id, title: i.title }));
  }, [userId]);

  // Só pode propor troca se: logado, item não for dele e tiver itens cadastrados
  const canPropose = Boolean(isAuthenticated && !isMine && myItems.length > 0);

  return (
    <article className="card-product card" data-id={id} aria-labelledby={titleId}>
      {/* Imagem do produto */}
      <div className="product-image">
        {isLoading && (
          <div className="image-loading" aria-hidden="true">
            <div className="loading-spinner" />
            Carregando imagem...
          </div>
        )}

        <img
          src={imgError ? fallbackImage : (image || fallbackImage)}
          alt={imageDescription || `Imagem do produto ${title}`}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ opacity: isLoading ? 0 : 1, transition: "opacity .2s ease" }}
        />

        {imgError && (
          <div className="image-error" aria-hidden="true">
            ⚠️ Imagem não disponível
          </div>
        )}
      </div>

      {/* Informações básicas do produto */}
      <div className="product-information">
        <h3 id={titleId} className="product-name">{title}</h3>
        <p className="product-category">{category}</p>
        <p className="product-location">{city}</p>
        <p className="product-condition">{condition}</p>
      </div>

      {/* Ações do card */}
      <div className="product-actions">
        {/* Link para detalhes */}
        <Link to={`/item/${id}`} className="btn btn--ghost">
          Ver Detalhes
        </Link>

        {/* Botão de propor troca */}
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setOpenTrade(true)}
          disabled={!canPropose}
          title={
            !isAuthenticated ? "Entre para propor trocas."
            : isMine ? "Este é seu item."
            : myItems.length === 0 ? "Cadastre ao menos um item para propor trocas."
            : undefined
          }
        >
          Propor Troca
        </button>
      </div>

      {/* Modal para enviar proposta de troca */}
      <ProposeTradeModal
        open={openTrade}
        onClose={() => setOpenTrade(false)}
        targetItemId={id}
        myItems={myItems}
      />
    </article>
  );
}

export default CardProduct;
