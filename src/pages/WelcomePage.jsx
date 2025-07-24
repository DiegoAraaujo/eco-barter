import HeroBanner from "../components/layout/HeroBanner";
import PopularCategories from "../components/layout/PopularCategories";
import AvailableProducts from "../components/layout/AvailableProducts";
import CallSection from "../components/layout/CallSection";
import HeaderWelcomePage from "../components/layout/HeaderWelcomePage";

function welcomePage() {
  return (
    <section>
      <HeaderWelcomePage/>
      <HeroBanner />
      <PopularCategories />
      <AvailableProducts />
      <CallSection />
    </section>
  );
}

export default welcomePage;
