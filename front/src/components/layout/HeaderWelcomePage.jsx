import "../../styles/headerWelcomePage.css";
import SmallerButton from "../ui/SmallerButton";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

function headerWelcomePage() {
  return (
    <header className="header-welcome-page">
      <img src={Logo} alt="Logo do site" />
      <div className="header-welcome-actions">
        <Link to="/login">
          <SmallerButton buttonMessage="Login" />
        </Link>
        <SmallerButton buttonMessage="Registrar-se" />
      </div>
    </header>
  );
}

export default headerWelcomePage;
