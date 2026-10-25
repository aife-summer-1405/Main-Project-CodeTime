import HeroContent from "./hero-content"
import HeroFilter from "./hero-filter"
import HeroMedia from "./hero-media-wrapper"

const HeroSection = () => {
  return (
    <div className="w-318.25 h-173.75 mt-6 mb-13.75 flex justify-between relative mx-auto">
      <HeroContent/>
      <HeroMedia/>
      <HeroFilter/>
    </div>
  )
}

export default HeroSection