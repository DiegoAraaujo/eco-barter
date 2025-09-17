import React, { useState } from "react";
import axios from "axios";
import "../styles/pages/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      fullName,
      email,
      password,
      phone,
      city,
      state,
    };

    try {
      const response = await axios.post("http://localhost:3000/usuarios", userData);
      console.log("Usuário cadastrado com sucesso:", response.data);
      // Limpar formulário após cadastro
      setName("");
      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setCity("");
      setState("");
      alert("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error.response?.data || error.message);
      alert("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="register-page" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h1>Registrar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome de Usuário:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Nome Completo:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Telefone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label>Cidade:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label>Estado:</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
