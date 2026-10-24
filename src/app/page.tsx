import HeroSection from "@/components/heroSection/hero-section";
import TopComments from "@/components/landing-bottom/comment/TopComments";
import FeaturedProperties from "@/components/landing-bottom/new-place/FeaturedProperties";
import PropertyCarousel from "@/components/landing-bottom/popular/PropertyCarousel";
import Categories from "@/components/landing-top/categories/categories";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center">
        <HeroSection />
        <Categories />
        <PropertyCarousel />
        <FeaturedProperties />
        <TopComments />
      </main>
    </>
  );
}
