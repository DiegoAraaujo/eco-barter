// Caminho do arquivo: src/pages/Item.jsx

// Página de detalhes de um item específico.
// - Obtém o `id` da rota (useParams).
// - Busca dados do item via `getItemById` (mocks/items).
// - Se não encontrar, mostra mensagem de erro + botão voltar.
// - Exibe imagem (com fallback), título, categoria, cidade, condição e descrição.
// - Inclui botão de voltar (histórico ou /catalogo).

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import { getItemById } from "../mocks/items";
import "../styles/pages/Item.css";

import IMG_FALLBACK from "../assets/img/placeholder.png"; // imagem padrão se a original falhar

const Item = () => {
  const { id } = useParams();           // id capturado da URL (/item/:id)
  const navigate = useNavigate();
  const itemData = getItemById(id);     // busca dados do item no "mock DB"

  // Volta para a página anterior ou para o catálogo
  const handleVoltar = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/catalogo");
  };

  // Caso o item não exista
  if (!itemData) {
    return (
      <Container size="lg" className="item-page">
        <main className="item-details" aria-labelledby="item-title">
          <PageTitle tag="h1" id="item-title">Item não encontrado</PageTitle>
          <div className="voltar-container">
            <ButtonLarge type="button" onClick={handleVoltar}>
              Voltar
            </ButtonLarge>
          </div>
        </main>
      </Container>
    );
  }

  // Caso o item exista
  return (
    <Container size="lg" className="item-page">
      <main className="item-details" aria-labelledby="titulo-item">
        <PageTitle tag="h1" className="item-details__title" id="titulo-item">
          {itemData.title}
        </PageTitle>

        <div className="item-layout">
          {/* Mídia: imagem do item */}
          <figure className="item-media">
            <img
              src={itemData.image}
              alt={`Imagem do item ${itemData.title}`}
              loading="lazy"
              decoding="async"
              // fallback automático caso a imagem falhe
              onError={(e) => {
                if (!e.currentTarget.dataset.fallback) {
                  e.currentTarget.dataset.fallback = "1";
                  e.currentTarget.src = IMG_FALLBACK;
                }
              }}
            />
            <figcaption className="visually-hidden">{itemData.title}</figcaption>
          </figure>

          {/* Detalhes do item */}
          <section className="detalhes-box" aria-labelledby="info-heading">
            <h2 id="info-heading" className="visually-hidden">Informações do item</h2>

            <dl className="item-meta">
              <div className="meta-row">
                <dt>Categoria</dt>
                <dd>{itemData.category}</dd>
              </div>
              <div className="meta-row">
                <dt>Cidade</dt>
                <dd>{itemData.city}</dd>
              </div>
              <div className="meta-row">
                <dt>Condição</dt>
                <dd>{itemData.condition}</dd>
              </div>
            </dl>

            <div className="descricao-item">
              <h3 className="descricao-title">Descrição</h3>
              <p>{itemData.description}</p>
            </div>
          </section>
        </div>

        {/* Botão voltar */}
        <div className="voltar-container">
          <ButtonLarge type="button" onClick={handleVoltar}>
            Voltar
          </ButtonLarge>
        </div>
      </main>
    </Container>
  );
};

export default Item;
