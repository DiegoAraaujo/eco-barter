import HeaderLogin from "../components/layout/headerLogin";
import Footer from "../components/layout/Footer";
import "../styles/login.css";
import logo2 from "../assets/logo2.png";
import BiggerButton from "../components/ui/BiggerButton";
import { useUserContext } from "../contexts/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    navigate("/catalogpage");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
      alert("insira um formato valido de email");
    }

    if (!password.trim() || password.length < 8) {
      alert("coloque uma senha valida");
    }

    try {
      const userLogged = await axios.post(
        "http://localhost:3000/usuarios/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(userLogged.data);
      navigate("/catalogpage");
    } catch (error) {
      alert("erro ao tentar realizar o login");
    }
  };

  return (
    <>
      <div className="pageLogin">
        <main className="mainLogin">
          <div className="bgForm">
            <img src={logo2} alt="Logo do Forms" />
            <p className="textTopForm">Acesse sua conta!</p>
            <form className="formLogin" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <BiggerButton buttontype="submit" buttonMessage="Entrar" />
            </form>
            <p className="textBottomForm">
              Ainda não tem conta? <a href="#">Cadastre-se</a>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

export default Login;
