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

  if (!itemData) {
    return (
      <Container className="item-not-found-container">
        <main className="item-details">
          <PageTitle>Item não encontrado</PageTitle>
          <div className="voltar-container">
            <Link to="/" className="btn-link">
              <ButtonLarge type="button">Voltar</ButtonLarge>
            </Link>
          </div>
        </main>
      </Container>
    );
  }

  return (
    <Container>
      <main className="item-details">
        <PageTitle className="item-details__title" id="titulo-item">
          {itemData.title}
        </PageTitle>

        <div className="detalhes-container">
          <div className="imagem-item">
            <img
              src={itemData.image}
              alt={`Imagem do item ${itemData.title}`}
              aria-label="Imagem do item"
              loading="lazy"
            />
          </div>

          <section className="detalhes-box" aria-label="Informações do item">
            <div className="detalhes-item">
              <p><strong>Categoria:</strong> {itemData.category}</p>
              <p><strong>Cidade:</strong> {itemData.city}</p>
              <p><strong>Condição:</strong> {itemData.condition}</p>
            </div>

            <div className="descricao-item">
              <p><strong>Descrição:</strong></p>
              <p>{itemData.description}</p>
            </div>

            <div className="botoes-acao">
              <ButtonLarge
                className="btn-troca"
                type="button"
                aria-label="Propor troca do item"
              >
                Propor troca
              </ButtonLarge>
            </div>
          </section>
        </div>

        <div className="voltar-container">
          <Link to="/" className="btn-link" aria-label="Voltar para a página anterior">
            <ButtonLarge type="button">Voltar</ButtonLarge>
          </Link>
        </div>
      </main>
    </Container>
  );
};

export default ItemDetails;
