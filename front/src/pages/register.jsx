import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import { useUserContext } from "../contexts/UserContext";

const Register = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/catalogpage");
    }
  }, [user, navigate]);

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
      if (!phone.trim()) {
        alert("insira um telefone valido!");
        return;
      }

      const userCreated = await axios.post(
        "http://localhost:3000/usuarios",
        userData,
        { withCredentials: true }
      );

      setName("");
      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setCity("");
      setState("");

      setUser(userCreated.data);
      navigate("/catalogpage");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
    }
  };

  return (
    <>
      <div className="page">
        <div
          className="register-page"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
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
                placeholder="(XX) XXXXX-XXXX"
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
      </div>
    </>
  );
};

export default Register;
