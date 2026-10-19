import HeroContent from "./hero-content"
import HeroFilter from "./hero-filter"

const HeroSection = () => {
  return (
    <div className="w-318.25 h-173.75 border border-red-1 mt-6 mb-13.75 flex justify-between relative">
      <HeroContent/>
      <div className="border border-green-1 w-141.25 h-154.5 ml-4 mt-8"></div>
      <HeroFilter/>
    </div>
  )
}

export default HeroSection