import HeroContent from "./hero-content"
import HeroFilter from "./hero-filter"
import HeroFilterMobile from "./hero-filter-mobile"
import HeroMedia from "./hero-media-wrapper"

const HeroSection = () => {
  return (
    <div className="max-w-318.25 w-[83%] max-xl:w-[95%] lg:h-173.75 mt-6 mb-13.75 flex justify-between max-lg:flex-col max-lg:items-center max-lg:gap-8 relative mx-auto">
      <HeroFilterMobile />
      <HeroContent />
      <HeroMedia />
      <HeroFilter />
    </div>
  )
}

export default HeroSection