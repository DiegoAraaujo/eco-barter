import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/register.css"; 

const Catalog = () => {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  // Buscar itens do back-end
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/items", {
        params: { category: category || undefined },
      });
      setItems(response.data);
      
      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Erro ao buscar itens:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  return (
    <div className="register-page" style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h1>Catálogo de Itens</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Filtrar por Categoria:</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          style={{ padding: "10px", borderRadius: "8px", width: "100%" }}
        >
          <option value="">Todas</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} style={{
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "15px",
              width: "calc(33.333% - 20px)",
              backgroundColor: "#f9fff9",
              boxShadow: "0 4px 10px rgba(102, 187, 106, 0.2)"
            }}>
              <img 
                src={item.imageUrl || "https://via.placeholder.com/150"} 
                alt={item.name} 
                style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
              />
              <h3 style={{ color: "#2e7d32", marginBottom: "5px" }}>{item.name}</h3>
              <p style={{ fontSize: "14px" }}>{item.description}</p>
              <p style={{ fontSize: "12px", fontStyle: "italic" }}>Categoria: {item.category}</p>
            </div>
          ))
        ) : (
          <p>Nenhum item encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
