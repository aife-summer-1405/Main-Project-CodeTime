import HeroSection from "@/components/heroSection/hero-section";
import BuySellSection from "@/components/landing-top/buy-sell/buy-sell";
import Categories from "@/components/landing-top/categories/categories";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <Categories />
      <BuySellSection/>
    </main>
  );
}
