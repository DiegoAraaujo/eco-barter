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
  const navigate = useNavigate();

  const handleDeleteItem = async (id) => {
    
    if (!window.confirm("Tem certeza que deseja excluir este item?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/item/${id}`);
      alert("Item excluído com sucesso!");
      navigate("/myarea");
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch(error) {
      console.error("Erro ao excluir o item:", error);
      alert("Erro ao excluir o item.");
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchItems() {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/item/account/${user.id}`
        );
        setItems(res.data);
      } catch (e) {
        alert(e?.message || "Erro ao carregar itens");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [user]);

  if (!user) return <p>Você precisa estar logado para ver seus itens.</p>;
  if (loading) return <p>Carregando itens...</p>;
  if (items.length === 0) return <p>Você ainda não cadastrou itens.</p>;

  return (
    <main className="main-container">
      <h1>Minha Área</h1>
      <section className="items-section">
        <div className="items-wrapper">
          <h2>Meus itens cadastrados</h2>
          <div className="grid-items">
            {items.map((item) => (
              <CardMyProduct
                key={item.id}
                image={item.imageUrl}
                imageDescription={item.description}
                productName={item.name}
                category={item.category}
                productState={item.status}
              >
                <div className="box-button">
                  <Link to={`/edit-item/${item.id}`}>
                    <SmallerButton buttonMessage="Editar" />
                  </Link>
                  <button onClick={() => handleDeleteItem(item.id)} className="smallerButton ">Remover</button>
                </div>
              </CardMyProduct>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MyArea;
