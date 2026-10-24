"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  Send,
  MessageCircle,
} from "lucide-react";

const searchLinks = [
  "رهن و اجاره ویلا در مازندران",
  "خرید ویلا در اصفهان",
  "فروش ویلا در مازندران",
  "خرید آپارتمان در ساری",
];

const magazineLinks = [
  "رهن و اجاره ویلا در مازندران",
  "خرید ویلا در اصفهان",
  "فروش ویلا در مازندران",
  "خرید آپارتمان در ساری",
];

const socialLinks = [
  {
    label: "واتساپ",
    href: "https://wa.me/",
    icon: MessageCircle,
  },
  {
    label: "تلگرام",
    href: "https://t.me/",
    icon: Send,
  },
  {
    label: "فیسبوک",
    href: "https://facebook.com/",
    icon: null,
  },
];

export default function SiteFooter() {
  return (
    <footer dir="ltr" className="relative mt-12 w-full font-sans">
      <div className="flex w-full items-stretch">
        <div className="relative min-w-0 flex-1 rounded-tl-[70px] bg-[#0862A5] px-4 pb-8 pt-10 sm:rounded-tl-[100px] sm:px-7 sm:pb-8 sm:pt-12 lg:rounded-tl-[130px] lg:px-10 xl:px-16">
          <div className="mx-auto max-w-350">
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-[1.25fr_0.9fr_1.1fr_1.1fr] lg:gap-x-7 xl:gap-x-12">
              <div className="order-1 min-w-0 lg:order-4">
                <Link
                  href="/"
                  aria-label="صفحه اصلی"
                  className="inline-flex items-center gap-2"
                >
                  <span className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    <span>رهن</span>
                    <span className="mr-1">کده</span>
                  </span>
                </Link>

                <p className="mt-5 max-w-md text-sm leading-7 text-white sm:text-base">
                  با ما هر قدم به سمت خانه‌تان را با اطمینان و آرامش طی کنید،
                  زیرا ما به شما در انتخابی هوشمندانه کمک می‌کنیم.
                </p>
              </div>

              <div className="order-2 min-w-0">
                <h3 className="mb-6 text-base font-bold text-white">
                  ارتباط با ما
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm leading-7">
                    <MapPin className="size-5 shrink-0" strokeWidth={1.7} />
                    <span>
                      مازندران - ساری - دودانگه
                      <br />
                      شهر ...
                    </span>
                  </div>

                  <a
                    href="tel:09112568987"
                    className="flex items-center gap-3 text-sm transition-opacity hover:opacity-75"
                  >
                    <Phone className="size-5 shrink-0" strokeWidth={1.7} />
                    <span dir="ltr">09112568987</span>
                  </a>

                  <a
                    href="mailto:example@gmail.com"
                    className="flex items-center gap-3 text-sm transition-opacity hover:opacity-75"
                  >
                    <Mail className="size-5 shrink-0" strokeWidth={1.7} />
                    <span className="break-all" dir="ltr">
                      example@gmail.com
                    </span>
                  </a>
                </div>
              </div>

              <div className="order-3 min-w-0">
                <h3 className="mb-6 text-base font-bold text-white">
                  بیشترین جستجو
                </h3>

                <ul className="flex flex-col gap-4">
                  {searchLinks.map((item) => (
                    <li key={item}>
                      <Link
                        href="/properties"
                        className="flex items-center gap-1 text-sm leading-6 text-white transition-opacity hover:opacity-70"
                      >
                        <ChevronLeft className="size-4 shrink-0" />
                        <span>{item}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-4 min-w-0 lg:order-1">
                <h3 className="mb-6 text-base font-bold text-white">
                  مجلات محبوب
                </h3>

                <ul className="flex flex-col gap-4">
                  {magazineLinks.map((item) => (
                    <li key={item}>
                      <Link
                        href="/magazine"
                        className="flex items-center gap-1 text-sm leading-6 text-white transition-opacity hover:opacity-70"
                      >
                        <ChevronLeft className="size-4 shrink-0" />
                        <span>{item}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 items-center gap-7 lg:mt-12 lg:grid-cols-[0.9fr_1.5fr] lg:gap-10">
              <form
                className="flex w-full items-center gap-3"
                onSubmit={(event) => event.preventDefault()}
              >
                <label htmlFor="footer-email" className="sr-only">
                  آدرس ایمیل
                </label>

                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="ایمیلت رو وارد کن"
                  className="h-11 min-w-0 flex-1 rounded-xl border-2 border-white bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/80 focus:ring-2 focus:ring-white/30"
                />

                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-xl bg-white px-7 text-sm font-semibold text-[#0862A5] transition-colors hover:bg-slate-100"
                >
                  ارسال
                </button>
              </form>

              <p className="text-center text-base font-bold leading-8 text-white sm:text-lg">
                در تمام لحظات میتونی با ما در ارتباط باشی پس همین حالا به ما
                بپیوند
              </p>
            </div>
          </div>
        </div>

        <aside
          aria-label="شبکه‌های اجتماعی"
          className="relative z-10 -mt-30 flex min-h-97.5 w-16 shrink-0 flex-col items-center justify-center gap-5 rounded-tl-[70px] bg-[#15977F] pt-8 sm:w-22.5 sm:rounded-tl-[100px] lg:w-31.5 lg:rounded-tl-[130px]"
        >
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-7 items-center justify-center text-white transition-transform hover:scale-110"
            >
              {Icon ? (
                <Icon size={22} strokeWidth={1.8} />
              ) : (
                <span className="font-sans text-[27px] font-bold leading-none">
                  f
                </span>
              )}
            </a>
          ))}
        </aside>
      </div>
    </footer>
  );
}
