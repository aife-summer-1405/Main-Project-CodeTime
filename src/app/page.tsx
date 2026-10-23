import HeroSection from "@/components/heroSection/hero-section";
import PropertyCarousel from "@/components/landing-bottom/popular/PropertyCarousel";
import Categories from "@/components/landing-top/categories/categories";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection />
      <Categories />
      <PropertyCarousel />
    </main>
  );
}
