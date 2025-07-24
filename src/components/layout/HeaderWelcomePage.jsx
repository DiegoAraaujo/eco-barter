import "../../styles/headerWelcomePage.css";
import SmallerButton from "../ui/SmallerButton";
import Logo from "../../assets/logo.svg";
function headerWelcomePage() {
  return (
    <header className="header-welcome-page">
      <img src={Logo} alt="Logo do site" />
      <div className="header-welcome-actions">
        <SmallerButton buttonMessage="Login" />
        <SmallerButton buttonMessage="Registrar-se" />
      </div>
    </header>
  );
}

export default headerWelcomePage;
