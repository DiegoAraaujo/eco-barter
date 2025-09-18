import logo1 from "../../assets/logo1.png";
import BiggerButton from "../ui/BiggerButton";
import { Link } from "react-router-dom";

import "../../styles/header.css";
function Header() {
  return (
    <>
      <header className="header-top">
        <div className="header-buttons">
          <img src={logo1} alt="LogoHeader" />

          <BiggerButton buttonMessage="Início" />
          <Link to="/additem">
            <BiggerButton buttonMessage="Cadastrar Item" />
          </Link>
          <BiggerButton buttonMessage="Sair" />
        </div>
      </header>
    </>
  );
}

export default Header;
