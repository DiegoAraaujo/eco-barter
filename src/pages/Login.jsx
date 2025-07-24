import HeaderLogin from "../components/layout/headerLogin";
import FooterLogin from "../components/layout/FooterLogin";
import "../styles/login.css"
import logo2 from "../assets/logo2.png"
import BiggerButton from "../components/ui/BiggerButton";

function Login() {

  return (
    <>
      <div className="pageLogin">
        <HeaderLogin />
        <main className="mainLogin">
          <div className="bgForm">
            <img src={logo2} alt="Logo do Forms" />
            <p className="textTopForm">Acesse sua conta!</p>
            <form className="formLogin">
              <input type="email" placeholder="Digite seu e-mail" />
              <input type="password" placeholder="Digite sua senha" />
              <BiggerButton buttonMenssage="Entrar" />
            </form>
            <p className="textBottomForm">Ainda não tem conta? <a href="#">Cadastre-se</a></p>
          </div>
        </main>
        <FooterLogin />
      </div>
    </>
  );
}

export default Login;