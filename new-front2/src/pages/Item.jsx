// Caminho do arquivo: src/pages/Item.jsx
//
// Página de detalhes de um item específico (sem mocks).
// - Lê o id pela rota.
// - Busca o item via services/items (NO-OP enquanto não há backend).
// - Exibe estados de loading, erro e "não encontrado".
// - Mantém layout, acessibilidade e fallback de imagem.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import { getItemById } from "../services/items"; // <- NO-OP por enquanto
import "../styles/pages/Item.css";

import IMG_FALLBACK from "../assets/img/placeholder.png";

const Item = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Carrega o item
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErrorMsg("");

    getItemById(id)
      .then((res) => {
        if (!alive) return;
        setItemData(res || null); // NO-OP retorna null até ter backend
      })
      .catch((e) => {
        if (!alive) return;
        setErrorMsg(e?.message || "Não foi possível carregar o item.");
        setItemData(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const handleVoltar = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/catalogo");
  };

  // Loading
  if (loading) {
    return (
      <Container size="lg" className="item-page">
        <main className="item-details" aria-busy="true" aria-live="polite">
          <PageTitle tag="h1">Carregando item…</PageTitle>
        </main>
      </Container>
    );
  }

  // Erro
  if (errorMsg) {
    return (
      <Container size="lg" className="item-page">
        <main className="item-details" aria-labelledby="item-erro">
          <PageTitle tag="h1" id="item-erro">Erro ao carregar</PageTitle>
          <p className="item-error">{errorMsg}</p>
          <div className="voltar-container">
            <ButtonLarge type="button" onClick={handleVoltar}>
              Voltar
            </ButtonLarge>
          </div>
        </main>
      </Container>
    );
  }

  // Não encontrado
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

  // Detalhes
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
              src={itemData.image || IMG_FALLBACK}
              alt={`Imagem do item ${itemData.title}`}
              loading="lazy"
              decoding="async"
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
                <dd>{itemData.category || "—"}</dd>
              </div>
              <div className="meta-row">
                <dt>Cidade</dt>
                <dd>{itemData.city || "—"}</dd>
              </div>
              <div className="meta-row">
                <dt>Condição</dt>
                <dd>{itemData.condition || "—"}</dd>
              </div>
            </dl>

            <div className="descricao-item">
              <h3 className="descricao-title">Descrição</h3>
              <p>{itemData.description || "Sem descrição."}</p>
            </div>
          </section>
        </div>

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
