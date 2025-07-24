import HeroBanner from "../components/layout/HeroBanner";
import PopularCategories from "../components/layout/PopularCategories";
import AvailableProducts  from "../components/layout/AvailableProducts";

function welcomePage() {
  return (
    <section>
      <HeroBanner/>
      <PopularCategories/>
      <AvailableProducts/>
    </section>
  );
}

export default welcomePage;
