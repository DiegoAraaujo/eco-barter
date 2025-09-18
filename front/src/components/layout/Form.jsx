import { useState } from "react";
import FormButton from "../ui/FormButton.jsx";
import "../../styles/form.css";
import { useUserContext } from "../../contexts/UserContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Form() {
  const { user } = useUserContext();
  const navigate = useNavigate();

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

  if (!user) {
    return <p>Você precisa estar logado!</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      !img.trim() ||
      !condition
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const itemCreated = await axios.post("http://localhost:3000/item", {
        name,
        description,
        category,
        district,
        imageUrl: img,
        condition,
        accountId: user.id,
      });

      setName("");
      setDescription("");
      setCategory("");
      setDistrict("");
      setImg("");
      setCondition("");

      navigate("/myarea");
    } catch (error) {
      console.error("Erro ao criar item:", error);
    }
  };

  return (
    <main className="form-container">
      <h3 className="textTopForm">Cadastrar novo item</h3>
      <div>
        <form className="form-box" onSubmit={handleSubmit}>
          <label>
            Título do item
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label>
            Descrição do item
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label>
            Categoria
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Selecione</option>
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
              required
            >
              <option value="">Selecione</option>
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
              placeholder="Digite o bairro ou cidade"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </label>

          <label>
            URL da Imagem
            <input
              type="text"
              name="img"
              placeholder="Cole a URL da imagem"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
          </label>

          <FormButton buttonMessage="Enviar" />
        </form>
      </div>
    </main>
  );
}

export default Form;
