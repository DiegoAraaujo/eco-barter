import { useEffect, useState } from "react";
import axios from "axios";
import SmallerButton from "../components/ui/SmallerButton";
import "../styles/personalData.css";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

export default function PersonalData() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const handleGoBack = () => { navigate("/myarea"); };
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return <p>Você precisa estar logado!</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      fullName: fullName || user.fullName,
      email: email || user.email,
      passwordHash: passwordHash || undefined,
      phone: phone || user.phone,
      city: city || user.city,
      state: state || user.state
    };

    try {
      const response = await axios.put(`http://localhost:3000/usuarios/${user.id}`, updateData);
      alert("Usuário atualizado com sucesso!");
      navigate("/myarea");
    } catch(error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar o usuário. Tente novamente.");
    }
  };

  return (
    <main className="main-dados">
      <h1>Dados Pessoais</h1>

      <div className="dados-box">
        <form className="dados-form" onSubmit={handleSubmit}>
          <fieldset className="grupo-campos">
            <legend>Informações Pessoais</legend>

            <div className="campo">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                placeholder="Ex.: Maria Souza"
                autoComplete="name"
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
              />
            </div>

            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                placeholder="Mín. 6 caracteres"
                autoComplete="new-password"
                minLength={6}
                value={passwordHash} 
                onChange={(e) => setPasswordHash(e.target.value)} 
              />
            </div>
          </fieldset>

          <fieldset className="grupo-campos">
            <legend>Contato e Endereço</legend>

            <div className="campo">
              <label htmlFor="telefone">Telefone (WhatsApp)</label>
              <input
                type="tel"
                placeholder="(88) 9 0000-0000"
                autoComplete="tel"
                inputMode="numeric"
                pattern="[0-9\s\(\)\-+]*"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </div>

            <div className="campo">
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                placeholder="Sobral"
                autoComplete="address-level2"
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
              />
            </div>

            <div className="campo">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                placeholder="CE"
                autoComplete="address-level1"
                maxLength={2}
                value={state} 
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </fieldset>
          
          <div className="box-button">
            <button type="button" onClick={handleGoBack} className="smallerButton">
              Voltar
            </button>
            <SmallerButton buttontype="submit" buttonMessage="Salvar Dados" />
          </div>
        </form>
      </div>
    </main>
  );
}