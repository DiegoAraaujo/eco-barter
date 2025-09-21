import { useState, useEffect } from "react";
import FormButton from "../ui/FormButton.jsx";
import "../../styles/editForm.css";
import { useUserContext } from "../../contexts/UserContext.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditItemForm() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const handleGoBack = () => {navigate("/myarea");};


  const categoryOpt = [
    { value: "BRINQUEDOS", label: "Brinquedos" },
    { value: "CALCADOS", label: "Calçados" },
    { value: "CELULARES", label: "Celulares" },
    { value: "ELETRODOMESTICOS", label: "Eletrodomésticos" },
    { value: "ESPORTES", label: "Esportes" },
    { value: "INFORMATICA", label: "Informática" },
    { value: "JARDINAGEM", label: "Jardinagem" },
    { value: "LIVROS", label: "Livros" },
    { value: "MOVEIS", label: "Móveis" },
    { value: "ROUPAS", label: "Roupas" },
  ];

  const conditionOpt = [
    { value: "NEW", label: "Novo" },
    { value: "USED", label: "Usado" },
    { value: "REFURBISHED", label: "Reformado" },
  ];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [img, setImg] = useState("");
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const loadItemData = async () => {
      if (!id) {
        setError("ID do item não fornecido");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:3000/item/${id}`);
        const item = response.data;
        
        if (item.accountId !== user?.id) {
          setError("Você não tem permissão para editar este item");
          setLoading(false);
          return;
        }
        
        setOriginalData({
          name: item.name || "",
          description: item.description || "",
          category: item.category || "",
          district: item.district || "",
          imageUrl: item.imageUrl || "",
          condition: item.condition || ""
        });
        
      } catch (error) {
        console.error("Erro ao carregar item:", error);
        setError("Item não encontrado ou erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadItemData();
    }
  }, [id, user]);

  if (!user) {
    return <p>Você precisa estar logado!</p>;
  }

  if (loading) {
    return <p>Carregando dados do item...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/myarea")}>Voltar</button>
      </div>
    );
  }

  if (!originalData) {
    return <p>Carregando dados do formulário...</p>;
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  const updateData = {
    name: name || originalData.name,
    description: description || originalData.description,
    category: category || originalData.category,
    district: district || originalData.district,
    imageUrl: img || originalData.imageUrl,
    condition: condition || originalData.condition
  };

  try {
    const response = await axios.put(`http://localhost:3000/item/${id}`, updateData);
    alert("Item atualizado com sucesso!");
    navigate("/myarea");
  } catch (error) {
    console.error("Erro completo:", error);
    console.error("Resposta do servidor:", error.response?.data);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Erro ao atualizar o item. Tente novamente.");
    }
  }
};

  return (
    <main className="form-container">
      <h3 className="textTopForm">Editar Item</h3>
      
      <div>
        <form className="form-box" onSubmit={handleSubmit}>
          <label>
            Título do item
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={originalData.name || "Título atual"}
            />
          </label>

          <label>
            Descrição do item
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={originalData.description || "Descrição atual"}
            />
          </label>

          <label>
            Categoria
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{originalData.category || "Selecione a categoria"}</option>
              {categoryOpt.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Condição
            <select
              name="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">{originalData.condition || "Selecione a condição"}</option>
              {conditionOpt.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Local
            <input
              type="text"
              name="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder={originalData.district || "Local atual"}
            />
          </label>

          <label>
            URL da Imagem
            <input
              type="text"
              name="img"    
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder={originalData.imageUrl || "URL da imagem atual"}
            />
          </label>
          <div className="container-button">
            <button type="button" onClick={handleGoBack} className="formButton">Voltar</button>
            <FormButton buttonMessage="Atualizar Item" />
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditItemForm;