
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

type PropertyCategory = {
  id: number;
  title: string;
  image: string;
  rating: string;
  count: string;
};

const categories: PropertyCategory[] = [
  {
    id: 1,
    title: "ویلای اصفهان",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=85",
    rating: "4.8",
    count: "۳۸",
  },
  {
    id: 2,
    title: "ویلای مشهد",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=85",
    rating: "4.7",
    count: "۴۲",
  },
  {
    id: 3,
    title: "ویلای یزد",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=90",
    rating: "4.9",
    count: "۵۶",
  },
  {
    id: 4,
    title: "ویلای مازندران",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85",
    rating: "4.8",
    count: "۶۱",
  },
  {
    id: 5,
    title: "ویلای سنندج",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=85",
    rating: "4.6",
    count: "۲۹",
  },
  {
    id: 6,
    title: "ویلای شیراز",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=85",
    rating: "4.9",
    count: "۴۷",
  },
  {
    id: 7,
    title: "ویلای تهران",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=85",
    rating: "4.7",
    count: "۳۴",
  },
];

export default function PropertyCategorySlider() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(2);

  const syncActiveSlide = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    syncActiveSlide();

    api.on("select", syncActiveSlide);
    api.on("reInit", syncActiveSlide);

    return () => {
      api.off("select", syncActiveSlide);
      api.off("reInit", syncActiveSlide);
    };
  }, [api, syncActiveSlide]);

  return (
    <section
      dir="rtl"
      className="w-full overflow-hidden px-2 py-10 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold tracking-wide text-sky-500 sm:text-sm">
            ✦✦✦ محبوب ترین جاهایی که میخوای اینجاست ✦✦✦
          </p>
          <h2 className="text-xl font-extrabold  sm:text-2xl">
            مناطق محبوب ویلایی
          </h2>
        </header>
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
            direction: "rtl",
            startIndex: 2,
            duration: 30,
          }}
          className="relative mx-auto w-full max-w-7xl px-8 sm:px-12"
        >
          <CarouselContent className="items-center py-7">
            {categories.map((category, index) => {
              const isActive = index === activeIndex;
              return (
                <CarouselItem
                  key={category.id}
                  className="flex basis-[72%] items-center justify-center pl-3 sm:basis-[38%] sm:pl-5 md:basis-[28%] lg:basis-[20%]"
                >
                  <button
                    type="button"
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`نمایش ${category.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "group relative block w-full overflow-hidden rounded-2xl text-right",
                      "transition-all duration-500 ease-in-out",
                      isActive
                        ? "z-10 scale-100 opacity-100 shadow-[0_0_30px_rgba(37,99,235,0.4)] ring-1 ring-blue-500/40"
                        : "scale-[0.88] opacity-75 hover:opacity-100",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "relative w-full overflow-hidden transition-all duration-500",
                        isActive
                          ? "h-62.5 sm:h-71.25"
                          : "h-38.75 sm:h-43.75",
                      ].join(" ")}
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/10" />
                      )}
                      <h3 className="absolute bottom-3 right-3 left-3 truncate text-sm font-bold text-white sm:text-base">
                        {category.title}
                      </h3>
                    </div>
                    <div
                      className={[
                        "flex items-center justify-between gap-2 bg-slate-950 px-3 transition-all duration-500",
                        isActive
                          ? "h-11 opacity-100"
                          : "h-0 overflow-hidden p-0 opacity-0",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-1 text-xs text-white sm:text-sm">
                        <Star
                          size={17}
                          className="fill-white text-white"
                        />
                        {category.rating}
                      </span>
                      <span className="truncate text-xs text-slate-300 sm:text-sm">
                        {category.title} ({category.count} مورد)
                      </span>
                    </div>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious
            aria-label="دسته قبلی"
            className="right-0 left-auto size-9 [&_svg]:rotate-180 border-0 bg-white text-blue-700 shadow-lg hover:bg-blue-50 sm:size-11"
          />
          <CarouselNext
            aria-label="دسته بعدی"
            className="left-0 right-auto size-9 [&_svg]:rotate-180 border-0 bg-white text-blue-700 shadow-lg hover:bg-blue-50 sm:size-11"
          />
        </Carousel>
      </div>
    </section>
  );
}
