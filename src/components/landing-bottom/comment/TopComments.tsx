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
import { Clock3, Heart, Quote } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  date: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "علیرضا",
    avatar: "/images/testimonials/alireza.jpg",
    comment:
      "من به تازگی از وبسایت رهن کده برای جستجوی یک خانه جدید استفاده کردم و واقعاً تجربه عالی و بی‌نظیری داشتم. بسیار سایت خوب و جامعی هست.",
    date: "۱۴۰۳/۰۲/۱۶",
  },
  {
    id: 2,
    name: "محمد",
    avatar: "/images/testimonials/alireza.jpg",
    comment:
      "جستجو بین گزینه‌های مختلف خیلی راحت بود. اطلاعات ملک‌ها کامل بود و تونستم گزینه مناسبی برای خودم پیدا کنم.",
    date: "۱۴۰۳/۰۲/۲۰",
  },
  {
    id: 3,
    name: "رضا",
    avatar: "/images/testimonials/alireza.jpg",
    comment:
      "طراحی سایت ساده و کاربردی است. دسته‌بندی‌ها کمک می‌کنند سریع‌تر به نتیجه دلخواهم برسم.",
    date: "۱۴۰۳/۰۲/۲۲",
  },
  {
    id: 4,
    name: "امیر",
    avatar: "/images/testimonials/alireza.jpg",
    comment:
      "تجربه خوبی داشتم. پیدا کردن آگهی‌ها آسان بود و نمایش اطلاعات باعث شد راحت‌تر تصمیم بگیرم.",
    date: "۱۴۰۳/۰۲/۲۵",
  },
  {
    id: 5,
    name: "علی",
    avatar: "/images/testimonials/alireza.jpg",
    comment:
      "یک سایت خوب برای بررسی و مقایسه گزینه‌های مختلف ملکی است. تجربه استفاده از آن برای من رضایت‌بخش بود.",
    date: "۱۴۰۳/۰۲/۲۸",
  },
];

export default function TopComments() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<number[]>([]);

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

  const toggleLike = (id: number) => {
    setLikedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-360 grid-cols-1 items-center gap-10 px-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10 lg:pl-8 lg:pr-12">
        <div className="relative z-10 text-right">
          <p className="mb-3 text-xs font-semibold leading-6 text-sky-500 sm:text-sm">
            نظرات ارزشمند شما، راهنمایی برای بهتر شدن ماست
          </p>

          <h2 className="text-2xl font-extrabold leading-relaxed sm:text-3xl">
            نظرات بازدیدکنندگان
          </h2>

          <p className="mt-5 text-sm leading-8 sm:text-base">
            نظرات شما درباره تجربه استفاده از سایت، به ما کمک می‌کند تا خدمات
            بهتری ارائه دهیم و تجربه جستجوی ملک را برای همه آسان‌تر کنیم.
          </p>

          <a
            href="/testimonials"
            className="mt-7 inline-flex items-center justify-center rounded-xl border-2 border-[#15977F] px-6 py-3 text-sm font-bold text-[#15977F] transition-colors hover:bg-[#15977F] hover:text-white"
          >
            مشاهده همه
          </a>
        </div>
        <div className="relative min-w-0">
          <div className="pointer-events-none absolute -bottom-3 right-[8%] h-[82%] w-[34%] rounded-t-[70px] rounded-b-[70px] bg-[#15977F] sm:right-[18%] sm:w-[32%]" />

          <Quote className="pointer-events-none absolute right-[25%] -top-6 z-10 size-8 fill-[#15977F] text-[#15977F]" />

          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
              direction: "rtl",
              startIndex: 0,
              duration: 30,
            }}
            className="relative z-10 w-full px-8 sm:px-12"
          >
            <CarouselContent className="-mr-3 items-center py-5">
              {testimonials.map((testimonial, index) => {
                const active = index === activeIndex;
                const liked = likedIds.includes(testimonial.id);

                return (
                  <CarouselItem
                    key={testimonial.id}
                    className="flex basis-[84%] items-center justify-center pl-3 sm:basis-[48%] lg:basis-[32%] xl:basis-[30%]"
                  >
                    <article
                      className={[
                        "flex w-full flex-col items-center rounded-2xl border-2 border-[#087CC2] bg-white-1 px-5 text-center text-[#10102E]",
                        "transition-all duration-500 ease-in-out",
                        active
                          ? "min-h-80 py-5 shadow-[0_8px_25px_rgba(0,0,0,0.15)] sm:min-h-80 sm:px-7 sm:py-5"
                          : "min-h-61.25 scale-[0.94] py-5 opacity-95 sm:min-h-61.25",
                      ].join(" ")}
                    >
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className={[
                          "rounded-full border-[5px] border-[#72F0A8] object-cover",
                          "transition-all duration-500",
                          active ? "size-24" : "size-17",
                        ].join(" ")}
                      />

                      <h3 className="mt-3 text-lg font-extrabold">
                        {testimonial.name}
                      </h3>

                      <p
                        className={[
                          "mt-2 text-sm leading-7",
                          active ? "line-clamp-5" : "line-clamp-2",
                        ].join(" ")}
                      >
                        {testimonial.comment}
                      </p>

                      <div className="mt-auto flex w-full items-center justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => toggleLike(testimonial.id)}
                          aria-label={liked ? "حذف پسندیدن" : "پسندیدن نظر"}
                          aria-pressed={liked}
                          className="rounded-full p-1 text-sky-600 transition-colors hover:bg-sky-100"
                        >
                          <Heart
                            size={22}
                            className={liked ? "fill-sky-500" : ""}
                          />
                        </button>

                        {active && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock3 size={17} />
                            {testimonial.date}
                          </span>
                        )}
                      </div>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious
              aria-label="نظر قبلی"
              className="right-0 left-auto size-9 border border-blue-600 bg-white text-blue-700 shadow-md hover:bg-blue-50 [&_svg]:rotate-180 sm:size-10"
            />

            <CarouselNext
              aria-label="نظر بعدی"
              className="left-0 right-auto size-9 border border-blue-600 bg-white text-blue-700 shadow-md hover:bg-blue-50 [&_svg]:rotate-180 sm:size-10"
            />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
