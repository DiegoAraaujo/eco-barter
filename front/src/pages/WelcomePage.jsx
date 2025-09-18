import HeroBanner from "../components/layout/HeroBanner";
import PopularCategories from "../components/layout/PopularCategories";
import AvailableProducts from "../components/layout/AvailableProducts";
import CallSection from "../components/layout/CallSection";
import HeaderWelcomePage from "../components/layout/HeaderWelcomePage";
import { useUserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function WelcomePage() {
  const { user, ready } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && ready) {
      navigate("/catalogpage"); 
    }
  }, [user, ready, navigate]);


  return (
    <section>
      <HeaderWelcomePage />
      <HeroBanner />
      <PopularCategories />
      <AvailableProducts />
      <CallSection />
    </section>
  );
}

export default WelcomePage;
