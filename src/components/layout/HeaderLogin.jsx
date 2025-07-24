import logo1 from "../../assets/logo1.png"
import "../../styles/layout/headerLogin.css"

function HeaderLogin () {

  return (
    <>
      <header className="headerLogin">
        <img src={logo1} alt="LogoHeader"/>
      </header>
    </>
  );
}

export default HeaderLogin