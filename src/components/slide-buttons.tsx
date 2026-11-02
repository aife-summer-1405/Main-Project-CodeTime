import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC } from "react";
import type { Swiper as SwiperType } from "swiper";


interface IProps  {
    swiper: SwiperType | null
}

const SlideButtons:FC<IProps> = ({swiper}) => {
  return (
        <div className="w-10 flex flex-col gap-2.5  shrink-0">
          <Button
            size={"icon"}
            onClick={() => {
              if (swiper && !swiper.destroyed) {
                swiper.slidePrev();
              }
            }}
            className="size-10 rounded-full bg-white-1 text-blue-1/40 hover:text-blue-1/80 shadow-[0px_0px_4px_0px_#10088F66] hover:shadow-[0px_0px_8px_0px_#10088FCC]"
            aria-label="prev slide"
          >
            <ChevronRight className="size-5.5" size={22} />
          </Button>

          <Button
            size={"icon"}
            onClick={() => {
              if (swiper && !swiper.destroyed) {
                swiper.slideNext();
              }
            }}
            className="size-10 rounded-full bg-white-1 text-blue-1/40 hover:text-blue-1/80 shadow-[0px_0px_4px_0px_#10088F66] hover:shadow-[0px_0px_8px_0px_#10088FCC]"
            aria-label="next slide"
          >
            <ChevronLeft className="size-5.5" size={22} />
          </Button>
        </div>  )
}

export default SlideButtons