"use client";
import { Underline1 } from "@/components/svgs/nav-underline";
import LandingTitle from "../landing-titles";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import {
  ArrowUpLeft,
  Bath,
  Bed,
  Car,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  TreeDeciduous,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BUY_SELL } from "@/constants/landing-top/buy-sell";

const BuySellSection = () => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="mt-17.75 mb-40 ">
      <div className="ml-23.5 flex flex-col gap-6 mr-23.5">
        <LandingTitle
          className="font-medium"
          text="خرید و فروش هوشمند، با بهترین پیشنهادات و قیمت‌های بی‌نظیر!"
        />
        <div className="flex gap-8 items-end">
          <RadioGroup className={"flex"} defaultValue={BUY_SELL[0]}>
            {BUY_SELL.map((item) => (

              <div key={item} className="group flex items-center gap-3">
                <RadioGroupItem
                  className={"peer sr-only gap-8"}
                  value={item}
                  id={item}
                />

                <div className="flex flex-col items-center justify-end relative">
                  <Label
                    className="flex justify-center h-10.25 cursor-pointer group-has-data-checked:text-xl group-has-data-checked:font-bold"
                    htmlFor={item}
                  >
                    {item}
                  </Label>
                  <div className="opacity-0 group-has-data-checked:opacity-100  group-has-data-checked:static absolute transition-opacity duration-500">
                  <Underline1 />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <Button
            className={
              "rounded-[12px] border-2 dark:border-green-1 border-green-1 text-green-1 font-medium w-30 h-10 mr-auto"
            }
            variant={"outline"}
          >
            مشاهده همه
          </Button>
        </div>
      </div>

      <div
        className="bg-linear-[0.32deg,rgba(245,245,245,0.6)_0.27%,rgba(227,242,255,0.6)_49.99%,rgba(245,245,245,0.6)_99.71%]
                  dark:bg-linear-[0.32deg,rgba(18,18,18,0.3)_0.27%,rgba(40,165,230,0.15)_49.99%,rgba(18,18,18,0.3)_99.71%] flex items-center gap-4 pr-23.5"
      >
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
        </div>
        <Swiper
          dir="rtl"
          slidesPerView={4}
          autoplay
          spaceBetween={16}
          onSwiper={setSwiper}
          className="w-full"
          slidesPerGroup={1}
        >
          <div className="float-end">
            {[...Array(12)].map((_, index) => (
              <SwiperSlide key={index} className="my-5 mr-px">
                <Card className="text-black-2 cursor-pointer border-2 hover:border-[#0887CA80] border-white-1 shadow-[0px_0px_6px_0px_#0887CA40] bg-white-1 rounded-[32px] p-[8px_7px_8px_7px] flex flex-col items-center w-full h-97">
                  <CardHeader
                    className="relative w-full h-50 overflow-hidden rounded-[24px_24px_4px_4px] p-0 
"
                  >
                    <div className="absolute z-99 bg-linear-[180deg,rgba(6,4,37,0.5)_30%,rgba(6,4,37,0)_100%] size-full flex p-2 text-white-1">
                      <span className="h-fit items-end flex gap-2 font-medium text-sm">
                        4.9
                        <Star />
                      </span>
                      <ArrowUpLeft className="mr-auto" />
                    </div>
                    <Image
                      className="object-cover"
                      src="/images/House1.jpg"
                      alt="Image"
                      fill
                      sizes="324px"
                    />
                  </CardHeader>
                  <CardContent className="w-full px-1 flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-1.5">
                      <h3 className="font-bold text-lg text-blue-1">
                        آپارتمان دوبلکس رامسر
                      </h3>
                      <span className="flex gap-px items-end text-sm text-black-2">
                        <MapPin />
                        رامسر، شهریار 3
                      </span>
                    </div>

                    <div className="w-full border-t border-black-2"></div>

                    <div className="flex flex-col gap-4.25">
                      <div className="flex gap-3 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-1">
                          <Bed />2 خواب
                        </div>
                        <div className="flex gap-1">
                          <Bath />1 حمام
                        </div>
                        <div className="flex gap-1">
                          <Car />1 پارکینگ
                        </div>
                        <div className="flex gap-1">
                          <TreeDeciduous /> حیاط
                        </div>
                      </div>
                      <div className="font-bold text-blue-3 text-base">
                        <span>250,000,000</span>
                        <span> تومان</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default BuySellSection;
