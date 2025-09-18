import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Item.css";

const FALLBACK_IMG = "https://via.placeholder.com/800x600?text=Sem+imagem";

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
    async function fetchItem() {
      setLoading(true);
      setErr("");

      try {
        const res = await axios.get(`http://localhost:3000/item/${id}`);
        setItem(res.data);
      } catch (e) {
        setErr(e?.message || "Erro ao carregar item");
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  if (loading) return <main className="item-details">Carregando item...</main>;
  if (err) return <main className="item-details">{err}</main>;
  if (!item) return <main className="item-details">Item não encontrado.</main>;

  const title = item.name;
  const image = item.imageUrl || FALLBACK_IMG;
  const location = item.account ? `${item.account.city}, ${item.account.state}` : "";

  const meta = [
    { label: "Categoria", value: item.category },
    { label: "Condição", value: CONDITION_LABEL[item.condition] || "" },
    { label: "Status", value: STATUS_LABEL[item.status] || "" },
    { label: "Localização", value: location },
  ].filter((m) => m.value);

  return (
    <div className="item-page">
      <main className="item-details" aria-labelledby="titulo-item">
        <h1 id="titulo-item" className="page-title">
          {title}
        </h1>

        <div className="item-layout">
          <figure className="item-media">
            <img src={image} alt={title} />
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
    </div>
  );
}
