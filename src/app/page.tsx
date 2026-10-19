import HeroSection from "@/components/heroSection/hero-section";
import Categories from "@/components/landing-top/categories/categories";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection />
      <Categories />
    </main>
  );
}
