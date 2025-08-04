import logo1 from "../../assets/logo1.png";
import "../../styles/header.css";
import BiggerButton from "../ui/BiggerButton";
function Header () {

  return (
    <>
      <header className="header-top">
        <div className="header-buttons">
        <img src={logo1} alt="LogoHeader"/>
          
        <BiggerButton buttonMessage="Início" />
        <BiggerButton buttonMessage="Cadastrar Item" />
        <BiggerButton buttonMessage="Sair" />
</div>
      </header>
    </>
  );
}

export default Header;
