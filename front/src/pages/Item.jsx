import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Item.css";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const FALLBACK_IMG = "https://via.placeholder.com/800x600?text=Sem+imagem";


const MOCK_ITEMS = {
  "1": {
    id: 1,
    accountId: 123,
    name: "Blazer Masculino Tamanho 42",
    registeredAt: "2025-01-01T10:00:00Z",
    imageUrl:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop",
    category: "Roupas",
    description:
      "Blazer social azul marinho, marca Reserva. Usado poucas vezes.",
    status: "AVAILABLE",         
    condition: "USED",  
    account: { city: "Belo Horizonte" }, 
  },

};

async function getItemById(id) {
    await new Promise((r) => setTimeout(r, 150));
  return MOCK_ITEMS[String(id)] || null;
}

const CONDITION_LABEL = {
  NEW: "Novo",
  USED: "Usado - Excelente estado",
  REFURBISHED: "Reformado",
  };

const STATUS_LABEL = {
  AVAILABLE: "Disponível",
  RESERVED: "Reservado",
  SOLD: "Indisponível",
};

export default function Item() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    getItemById(id)
      .then((data) => alive && setItem(data))
      .catch((e) => alive && setErr(e?.message || "Erro ao carregar"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (!item) return <main className="item-details">Item não encontrado.</main>;

  const title = item.name ;
  const image = item.imageUrl ;

  const meta = [
    { label: "Categoria", value: item.category },
      { label: "Condição", value: CONDITION_LABEL[item.condition] || "" },
    { label: "Status", value: STATUS_LABEL[item.status] || "" },
  ].filter((m) => m.value);

  return (
    
    <div className="item-page">
       <Header />
      <main className="item-details" aria-labelledby="titulo-item">
       
        <h1 id="titulo-item" className="page-title">
          {title}
        </h1>

        <div className="item-layout">
          <figure className="item-media">
            <img
              src={image}
              alt={title}  />
          </figure>

          <section className="detalhes-box" aria-labelledby="info-heading">
               {meta.length > 0 && (
              <dl className="item-meta">
                {meta.map(({ label, value }) => (
                  <div className="meta-row" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="descricao-item">
              <h3 className="descricao-title">Descrição</h3>
              <p>{item.description || "Sem descrição."}</p>
            </div>
          </section>
        </div>

        <div className="voltar-container">
          <button
            type="button"
            className="btn-voltar"
            onClick={() =>
              window.history.length > 1 ? navigate(-1) : navigate("/")
            }
          >
            Voltar
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
