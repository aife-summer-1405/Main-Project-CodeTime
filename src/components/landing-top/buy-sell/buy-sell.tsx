"use client";
import { NavUnderlineMobile, Underline1 } from "@/components/svgs/underline";
import LandingTitle from "../landing-titles";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BUY_SELL } from "@/constants/landing-top/buy-sell";
import PropertyCard from "./property-card";
import SlideButtons from "@/components/slide-buttons";

const BuySellSection = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="mt-17.75 mb-40">
      <div className="mx-23.5 max-[600px]:m-0 flex flex-col max-[820px]:items-center gap-6">
        <LandingTitle
          className="font-medium"
          text="خرید و فروش هوشمند، با بهترین پیشنهادات و قیمت‌های بی‌نظیر!"
        />
        <div className="flex gap-8 items-end">
          <RadioGroup className={"flex gap-8"} defaultValue={BUY_SELL[0]}>
            {BUY_SELL.map((item) => (
              <div key={item} className="group flex items-center gap-3">
                <RadioGroupItem
                  className="peer"
                  value={item}
                  id={item}
                />

                <div className="flex flex-col items-center justify-end relative">
                  <Label
                    className="flex justify-center h-10.25 cursor-pointer max-md:text-sm group-has-data-checked:text-xl max-md:group-has-data-checked:text-md group-has-data-checked:font-bold"
                    htmlFor={item}
                  >
                    {item}
                  </Label>
                  <div className="opacity-0 scale-x-300 group-has-data-checked:opacity-100  group-has-data-checked:static absolute transition-opacity duration-500">
                    <NavUnderlineMobile />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <Button
            className={
              "max-[820px]:hidden rounded-[12px] border-2 dark:border-green-1 border-green-1 text-green-1 font-medium w-30 h-10 mr-auto"
            }
            variant={"outline"}
          >
            مشاهده همه
          </Button>
        </div>
      </div>

      <div
        className="max-lg:hidden bg-linear-[0.32deg,rgba(245,245,245,0.6)_0.27%,rgba(227,242,255,0.6)_49.99%,rgba(245,245,245,0.6)_99.71%]
                  dark:bg-linear-[0.32deg,rgba(18,18,18,0.3)_0.27%,rgba(40,165,230,0.15)_49.99%,rgba(18,18,18,0.3)_99.71%] flex items-center gap-4 pr-23.5"
      >
        <SlideButtons swiper={swiper} />
        <Swiper
          dir="rtl"
          slidesPerView={4}
          autoplay
          spaceBetween={16}
          onSwiper={setSwiper}
          className="w-full"
          slidesPerGroup={1}
          breakpoints={{
            0: {
              slidesPerView: 1.6,
              spaceBetween: 10,
            },
            850: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1165: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1500: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
        >
          <div className="float-end">
            {[...Array(12)].map((_, index) => (
              <SwiperSlide key={index} className="my-5 mr-px">
                <PropertyCard key={index} />
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
      <div className="flex flex-col items-center gap-4 mt-6 lg:hidden">
        {[...Array(4)].map((_, index) => (
          <PropertyCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default BuySellSection;
