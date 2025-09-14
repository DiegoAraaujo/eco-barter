// Caminho do arquivo: src/pages/MyArea.jsx
// Página "Minha Área" do usuário (sem mocks).
// - Lê itens do usuário a partir de localStorage (services/storage.loadTable("items")).
// - Mantém propostas via TradeContext (received/sent) e ações (aceitar/recusar/remover).
// - Atualiza a UI quando "ecobarter:items" mudar em outra aba (evento 'storage').
// - Renderiza imagens com fallback e botões com diálogos de confirmação.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import ButtonLarge from "../components/ui/ButtonLarge";
import ConfirmDialog from "../components/ui/ConfirmDialog";

import "../styles/pages/MyArea.css";

import { useTrade } from "../context/useTrade";
import { useAuth } from "../context/AuthContext";
import { loadTable } from "../services/storage"; // <- troca mocks por storage
import placeholder from "../assets/img/placeholder.png";

const IMG_FALLBACK = placeholder;
const FULL_ITEMS_KEY = "ecobarter:items"; // bate com services/storage (NAMESPACE: 'ecobarter')

/** Miniatura de item (thumbnail) com fallback automático */
const Thumb = ({ className = "proposta-thumb", ...props }) => (
  <img
    {...props}
    className={className}
    loading="lazy"
    width="72"
    height="72"
    onError={(e) => {
      if (!e.currentTarget.dataset.fallback) {
        e.currentTarget.dataset.fallback = "1";
        e.currentTarget.src = IMG_FALLBACK;
      }
    }}
    style={{ objectFit: "cover" }}
  />
);

const MyArea = () => {
  const { received, sent, accept, decline, remove } = useTrade(); // propostas
  const { user } = useAuth(); // usuário logado
  const userId = user?.id ? String(user.id) : null;

  // ====== Itens (tabela "items" no localStorage) ======
  const [allItems, setAllItems] = useState(() => loadTable("items")); // array de itens

  // Ouve alterações na tabela "items" vindas de outras abas/janelas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === FULL_ITEMS_KEY) {
        setAllItems(loadTable("items"));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Meus itens atuais (mini lista para a seção "Meus Itens")
  const myItemsInitial = useMemo(() => {
    if (!userId) return [];
    return (allItems || [])
      .filter((i) => String(i.owner) === userId)
      .map((i) => ({ id: i.id, nome: `${i.title} — ${i.city || ""}`, image: i.image }));
  }, [allItems, userId]);

  const [meusItens, setMeusItens] = useState(myItemsInitial);

  // Atualiza quando usuário ou a tabela mudar
  useEffect(() => {
    setMeusItens(myItemsInitial);
  }, [myItemsInitial]);

  // Mapa auxiliar de itens por id
  const byId = useMemo(
    () => Object.fromEntries((allItems || []).map((i) => [i.id, i])),
    [allItems]
  );

  // ====== Adapters de view (para exibir propostas de forma amigável) ======
  const rcvView = useMemo(
    () =>
      received.map((p) => ({
        id: p.id,
        status: p.status,
        nome: "Usuário", // placeholder (sem backend real)
        itemProprio: byId[p.targetItemId]?.title ?? "Meu item",
        itemProposto: byId[p.offeredItemId]?.title ?? "Item do usuário",
        image: byId[p.offeredItemId]?.image,
        detailsItemId: p.offeredItemId, // exibe detalhes do item proposto
      })),
    [received, byId]
  );

  const sentView = useMemo(
    () =>
      sent.map((p) => ({
        id: p.id,
        status: p.status,
        itemProprio: byId[p.offeredItemId]?.title ?? "Meu item",
        itemProposto: byId[p.targetItemId]?.title ?? "Item alvo",
        image: byId[p.targetItemId]?.image,
        detailsItemId: p.targetItemId, // exibe detalhes do item alvo
      })),
    [sent, byId]
  );

  // ====== Diálogo de confirmação ======
  const [confirm, setConfirm] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Configura mensagens do dialog
  const askRemoveItem = (id, nome) => setConfirm({
    type: "item",
    id,
    title: "Remover item?",
    desc: `O item "${nome}" será removido da sua lista. Essa ação não pode ser desfeita.`,
  });

  const askRemoveSent = (id, alvo) => setConfirm({
    type: "sent",
    id,
    title: "Remover proposta?",
    desc: `A proposta enviada para "${alvo}" será removida. Essa ação não pode ser desfeita.`,
  });

  const askAcceptReceived = (id, itemProposto, nome) => setConfirm({
    type: "received",
    action: "accept",
    id,
    title: "Aceitar proposta?",
    desc: `${nome} propôs trocar "${itemProposto}". A proposta será marcada como aceita.`,
  });

  const askDeclineReceived = (id, itemProposto, nome) => setConfirm({
    type: "received",
    action: "decline",
    id,
    title: "Recusar proposta?",
    desc: `Tem certeza que deseja recusar a proposta de ${nome} para "${itemProposto}"?`,
  });

  // Executa ação confirmada
  const handleConfirm = async () => {
    if (!confirm) return;
    setConfirmLoading(true);
    try {
      if (confirm.type === "item") {
        // Remoção apenas visual (não persiste, conforme comentário original)
        setMeusItens((prev) => prev.filter((i) => i.id !== confirm.id));
      } else if (confirm.type === "sent") {
        await remove(confirm.id);
      } else if (confirm.type === "received") {
        confirm.action === "accept"
          ? await accept(confirm.id)
          : await decline(confirm.id);
      }
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };
  const handleCancel = () => setConfirm(null);

  // Renderiza status textual com emoji
  const renderStatus = (s) => {
    if (s === "aguardando") return "🕒 Aguardando";
    if (s === "aceito") return "✅ Aceita";
    if (s === "recusado") return "❌ Recusada";
    if (s === "cancelado") return "⛔ Cancelada";
    return s;
  };

  return (
    <Container className="my-area" size="lg">
      <PageTitle tag="h1">Minha Área</PageTitle>

      {/* Meus Itens */}
      <article className="card-area" role="region" aria-labelledby="meus-itens">
        <h2 id="meus-itens">📦 Meus Itens Cadastrados</h2>
        {meusItens.length === 0 ? (
          <p className="estado-vazio">
            Você ainda não cadastrou itens. <Link to="/add-item">Cadastre o primeiro</Link>.
          </p>
        ) : (
          <ul className="lista-itens">
            {meusItens.map((item) => (
              <li key={item.id} className="item-proposta">
                <div className="proposta-conteudo">
                  <Thumb src={item.image} alt={item.nome} />
                  <div className="proposta-detalhes">
                    <p>{item.nome}</p>
                    <div className="acoes-proposta">
                      <Link to={`/item/${item.id}`} className="btn detalhes">
                        🔍 Ver Detalhes
                      </Link>
                      <button
                        onClick={() => askRemoveItem(item.id, item.nome)}
                        className="btn remover"
                      >
                        🗑 Remover Item
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      {/* Propostas Recebidas */}
      <article className="card-area" role="region" aria-labelledby="propostas-recebidas">
        <h2 id="propostas-recebidas">📩 Propostas Recebidas</h2>
        {rcvView.length === 0 ? (
          <p className="estado-vazio">Sem propostas recebidas no momento.</p>
        ) : (
          <ul className="lista-itens">
            {rcvView.map((p) => (
              <li key={p.id} className={`item-proposta ${p.status}`}>
                <div className="proposta-conteudo">
                  <Thumb src={p.image} alt={`Imagem do item proposto: ${p.itemProposto}`} />
                  <div className="proposta-detalhes">
                    <p>
                      {p.nome} propôs trocar <strong>{p.itemProposto}</strong> pelo seu "{p.itemProprio}"
                    </p>
                    <span className={`status ${p.status}`}>{renderStatus(p.status)}</span>
                    <div className="acoes-proposta">
                      {p.status === "aguardando" && (
                        <>
                          <button
                            className="btn aceitar"
                            onClick={() => askAcceptReceived(p.id, p.itemProposto, p.nome)}
                            disabled={confirmLoading}
                          >
                            ✅ Aceitar
                          </button>
                          <button
                            className="btn recusar"
                            onClick={() => askDeclineReceived(p.id, p.itemProposto, p.nome)}
                            disabled={confirmLoading}
                          >
                            ❌ Recusar
                          </button>
                        </>
                      )}
                      <Link to={`/item/${p.detailsItemId}`} className="btn detalhes">
                        🔍 Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      {/* Propostas Enviadas */}
      <article className="card-area" role="region" aria-labelledby="propostas-enviadas">
        <h2 id="propostas-enviadas">📤 Minhas Propostas Enviadas</h2>
        {sentView.length === 0 ? (
          <p className="estado-vazio">Você ainda não enviou propostas.</p>
        ) : (
          <ul className="lista-itens">
            {sentView.map((p) => (
              <li key={p.id} className={`item-proposta ${p.status}`}>
                <div className="proposta-conteudo">
                  <Thumb src={p.image} alt={`Imagem do item alvo: ${p.itemProposto}`} />
                  <div className="proposta-detalhes">
                    <p>
                      Você propôs trocar <strong>{p.itemProprio}</strong> pelo item "{p.itemProposto}"
                    </p>
                    <span className={`status ${p.status}`}>{renderStatus(p.status)}</span>
                    <div className="acoes-proposta">
                      <Link to={`/item/${p.detailsItemId}`} className="btn detalhes">
                        🔍 Ver Detalhes
                      </Link>
                      <button
                        className="btn remover"
                        onClick={() => askRemoveSent(p.id, p.itemProposto)}
                        disabled={confirmLoading}
                      >
                        🗑 Remover Proposta
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      {/* CTA para explorar catálogo */}
      <section className="browse-items" aria-labelledby="itens-disponiveis">
        <h2 id="itens-disponiveis">Quer explorar novos itens?</h2>
        <p>Veja todos os itens disponíveis para troca e encontre a sua próxima troca consciente.</p>
        <ButtonLarge to="/catalogo" variant="ghost" size="md">
          Ver todos os itens
        </ButtonLarge>
      </section>

      {/* CTA cadastrar item */}
      <div className="botao-centralizado">
        <ButtonLarge to="/add-item" size="md">
          ➕ Cadastrar Novo Item
        </ButtonLarge>
      </div>

      {/* Diálogo de confirmação */}
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        description={confirm?.desc}
        confirmText={
          confirm?.type === "received"
            ? confirm?.action === "accept"
              ? "Aceitar"
              : "Recusar"
            : "Remover"
        }
        cancelText="Cancelar"
        destructive={confirm?.type !== "received" || confirm?.action === "decline"}
        loading={confirmLoading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default MyArea;
