import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import PageTitle from '../components/ui/PageTitle';
import ButtonLarge from '../components/ui/ButtonLarge';
import { getItemById } from '../mocks/items';
import '../styles/pages/ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const itemData = getItemById(id);

  // Conteúdo para item não encontrado
  if (!itemData) {
    return (
      <Container className="item-not-found-container">
        <PageTitle aria-live="assertive">Item não encontrado</PageTitle>
        <div className="voltar-container">
          <Link to="/" className="btn-link" aria-label="Voltar para página inicial">
            <ButtonLarge type="button">Voltar</ButtonLarge>
          </Link>
        </div>
      </Container>
    );
  }

  // Conteúdo para item encontrado
  return (
    <Container>
      <article className="item-details" aria-labelledby="titulo-item">
        <PageTitle className="item-details__title" id="titulo-item">
          {itemData.title}
        </PageTitle>

        <div className="detalhes-container">
          <figure className="imagem-item">
            <img
              src={itemData.image}
              alt={`Imagem do item ${itemData.title}`}
              loading="lazy"
              width="400"
              height="400"
            />
          </figure>

          <section className="detalhes-box" aria-labelledby="info-item">
            <h2 id="info-item" className="visually-hidden">Informações do item</h2>
            
            <div className="detalhes-item">
              <p><strong>Categoria:</strong> {itemData.category}</p>
              <p><strong>Cidade:</strong> {itemData.city}</p>
              <p><strong>Condição:</strong> {itemData.condition}</p>
            </div>

            <div className="descricao-item">
              <h3>Descrição</h3>
              <p>{itemData.description}</p>
            </div>

            <div className="botoes-acao">
              <ButtonLarge
                className="btn-troca"
                type="button"
                aria-label={`Propor troca para o item ${itemData.title}`}
              >
                Propor troca
              </ButtonLarge>
            </div>
          </section>
        </div>

        <div className="voltar-container">
          <Link to="/" className="btn-link" aria-label="Voltar para página inicial">
            <ButtonLarge type="button">Voltar</ButtonLarge>
          </Link>
        </div>
      </article>
    </Container>
  );
};

export default ItemDetails;
