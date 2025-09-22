import { useEffect, useState } from "react";
import axios from "axios";
import CardMyProduct from "../components/ui/CardMyProduct";
import SmallerButton from "../components/ui/SmallerButton";
import "../styles/myArea.css";
import { useUserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";

function MyArea() {
  const { user } = useUserContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infoUser, setInfoUser] = useState([]);
  const navigate = useNavigate();

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este item?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/item/${id}`);
      alert("Item excluído com sucesso!");
      navigate("/myarea");
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao excluir o item:", error);
      alert("Erro ao excluir o item.");
    }
  };

useEffect(() => {
  if (!user?.id) {
    setLoading(false);
    return;
  }

  async function fetchAllData() {
    setLoading(true);
    try {
      const [itemsResponse, userResponse] = await Promise.all([
        axios.get(`http://localhost:3000/item/account/${user.id}`),
        axios.get(`http://localhost:3000/usuarios/me`)
      ]);

      setItems(itemsResponse.data);
      setInfoUser([
        { label: "Nome: ", value: userResponse.data.fullName },
        { label: "Email: ", value: userResponse.data.email },
        { label: "Senha: ", value: "******" },
        { label: "Telefone: ", value: userResponse.data.phone },
        { label: "Cidade: ", value: userResponse.data.city },
        { label: "Estado: ", value: userResponse.data.state }
      ]);
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  fetchAllData();
}, [user]);


  if (!user) return <p>Você precisa estar logado para ver seus itens.</p>;
  if (loading) return <p>Carregando itens...</p>;

  return (
    <main className="main-container">
      <h1>Minha Área</h1>
      <div className="container-section">
        <section className="profile-section">
          <div className="profile-wrapper">
            <h2>Meu perfil</h2>
            <div className="container-info">
              {infoUser.map(
                (info, index) =>
                  info.value && (
                    <div key={index} className="info-value">
                      <strong>{info.label}</strong>
                      <span>{info.value || "Não informado"}</span>
                      <br />
                      <br />
                    </div>
                  )
              )}
              <Link to={`/personal-data/${user.id}`}>
                <SmallerButton buttonMessage="Editar Informações" />
              </Link>
            </div>
          </div>
        </section>
        <section className="items-section">
          <div className="items-wrapper">
            <h2>Meus itens cadastrados</h2>
            {items.length === 0 ? (
              <p className="text-alert">Nenhum item cadastrado</p>
            ) : (
              <div className="grid-items">
                {items.map((item) => (
                  <CardMyProduct
                    key={item.id}
                    imageUrl={item.imageUrl}
                    imageDescription={item.description}
                    productName={item.name}
                    category={item.category}
                    productState={item.status}
                  >
                    <div className="box-button">
                      <Link to={`/edit-item/${item.id}`}>
                        <SmallerButton buttonMessage="Editar" />
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="smallerButton "
                      >
                        Remover
                      </button>
                    </div>
                  </CardMyProduct>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default MyArea;
