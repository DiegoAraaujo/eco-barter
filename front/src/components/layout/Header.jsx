import Logo from "../../assets/logo.svg";
import SmallerButton from "../ui/SmallerButton";
import { Link } from "react-router-dom";

import "../../styles/header.css";
function Header() {
  return (
    <>
      <header className="header-top">
        <img src={Logo} alt="Logo do site" />
        <div className="header-actions">
          <Link to="/myarea">
            <SmallerButton buttonMessage="Minha Area" />
          </Link>
          <Link to="/additem">
            <SmallerButton buttonMessage="Cadastrar Item" />
          </Link>
          <Link to="/catalogpage">
            <SmallerButton buttonMessage="Catálogo" />
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header;
