// Caminho do arquivo: src/components/ui/CardProduct.jsx
// Este componente representa um "card" individual de produto no catálogo.
// - Mostra imagem, título, categoria, cidade e condição do item.
// - Lida com carregamento e erro de imagem (placeholder quando necessário).
// - Oferece ações: "Ver Detalhes" e "Propor Troca" (se permitido).
// - Controla modal de proposta de troca (ProposeTradeModal).
// - Verifica se o item pertence ao usuário logado e só permite propor troca se não for dele.
// - ✅ Sem dependência de mocks. O pai deve informar `owner` e `myItems` (itens do usuário logado).

import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import "../../styles/components/ui/CardProduct.css";
import placeholderImg from "../../assets/img/placeholder.png";

import ProposeTradeModal from "../trade/ProposeTradeModal";
import { useAuth } from "../../context/AuthContext";

function CardProduct({
  id,
  owner,                // <-- NOVO: id do dono do item (string|number)
  image,
  imageDescription,
  title,
  category,
  city,
  condition,
  myItems = [],         // <-- NOVO: itens do usuário logado [{id, title}], para propor troca
  fallbackImage = placeholderImg, // imagem padrão se não carregar
}) {
  const titleId = `product-title-${id}`;
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openTrade, setOpenTrade] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const userId = user?.id ? String(user.id) : null;

  // Handlers para carregamento/erro da imagem
  const handleLoad = () => setIsLoading(false);
  const handleError = () => { setIsLoading(false); setImgError(true); };

  // Dono do item atual (sem mocks: vem via props)
  const itemOwnerId = useMemo(() => (owner != null ? String(owner) : ""), [owner]);
  const isMine = Boolean(userId && itemOwnerId && itemOwnerId === userId);

  // Só pode propor troca se: logado, item não for dele e tiver itens cadastrados
  const canPropose = Boolean(isAuthenticated && !isMine && myItems.length > 0);

  // Objeto do item alvo para o modal (sem buscar em mock)
  const targetItem = useMemo(
    () => ({ id, owner: itemOwnerId || undefined, title }),
    [id, itemOwnerId, title]
  );

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
        <Link to={`/item/${id}`} className="btn btn--ghost">
          Ver Detalhes
        </Link>

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
        targetItemId={id}             // mantido p/ compatibilidade
        targetItem={targetItem}       // <-- NOVO: evita mocks dentro do modal
        myItems={myItems}             // itens do usuário para oferecer
      />
    </article>
  );
}

export default CardProduct;
