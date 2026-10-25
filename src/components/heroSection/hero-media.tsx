"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { useState } from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_MEDIA } from "@/constants/hero-section";

const HeroMedia = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="rounded-[8px_100px_8px_100px] shadow-[0px_0px_40px_0px_#005EA433] z-0 w-141.25 h-154.5 ml-4 mt-8 relative">
      <div className="w-10 flex flex-col gap-2.5 absolute z-99 -left-5 top-1/2 -translate-y-1/2">
        <Button
          size={"icon"}
          onClick={() => {
            if (swiper && !swiper.destroyed) {
              swiper.slideNext();
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
              swiper.slidePrev();
            }
          }}
          className="size-10 rounded-full bg-white-1 text-blue-1/40 hover:text-blue-1/80 shadow-[0px_0px_4px_0px_#10088F66] hover:shadow-[0px_0px_8px_0px_#10088FCC]"
          aria-label="next slide"
        >
          <ChevronLeft className="size-5.5" size={22} />
        </Button>
      </div>
      <Swiper
        dir="ltr"
        modules={[Pagination, EffectFade, Autoplay]}
        effect="fade"
        loop={true}
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1200}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
        onSwiper={setSwiper}
        className="w-full h-full"
        slidesPerGroup={1}
      >
        {HERO_MEDIA.map((item) => (
          <SwiperSlide
            className="rounded-[8px_100px_8px_100px] overflow-hidden "
            key={item}
          >
            <Image
              className="object-cover -scale-x-100"
              src={item}
              alt="Image"
              fill
              sizes="324px"
              loading="eager"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroMedia;
