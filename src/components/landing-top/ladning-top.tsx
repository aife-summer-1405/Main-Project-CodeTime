import HeroSection from "../heroSection/hero-section";
import BuySellSection from "./buy-sell/buy-sell";
import Categories from "./categories/categories";

const LandingTop = () => {
  return (
    <>
      <HeroSection />
      <Categories />
      <BuySellSection />
    </>
  );
};

export default LandingTop;
