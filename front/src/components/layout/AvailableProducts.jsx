import "../../styles/availableProducts.css";
import CardProductWp from "../ui/CardProductWP";
import { useState, useEffect } from "react";
import axios from "axios";

function AvailableProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/item/catalog`);
      console.log(res.data);
      setItems(res.data);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section className="products-section">
      <h2>Itens disponíveis para troca</h2>

      <div className="Products-list">
        {loading ? (
          <h2>Carregando catálogo...</h2>
        ) : items.length === 0 ? (
          <h2>Nenhum item encontrado nesta categoria</h2>
        ) :  (
          items.slice(0, 6).map((item) => (
            <CardProductWp
              key={item.id}
              id={item.id}
              imageUrl={item.imageUrl}
              nameProduct={item.name}
              location={item.account.city}
              itemCondition={item.condition}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default AvailableProducts;
