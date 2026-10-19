import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type HeroButton = {
  title: string;
  href: string;
  variant: VariantProps<typeof buttonVariants>["variant"] | null;
  classname: string;
};

export const HERO_CONTENT = {
  title: {
    title1: "با ما به",
    title2: "خانه‌تان",
    title3: "نزدیک‌تر شوید !",
  },
  buttons: [
    {
      title: "با یه کلیک شروع کن !",
      href: "/reserve",
      variant: "default",
      classname:
        "text-white-1 bg-blue-1 dark:bg-white-1 dark:text-black-2 w-62.5",
    },
    {
      title: "درباره رهن کده",
      href: "/about-us",
      variant: "outline",
      classname:
        "border-blue-1 text-blue-1 dark:border-white-1 dark:text-white-1 w-45",
    },
  ] satisfies HeroButton[],
  info: [
    {
      title: "ملک برای رهن و اجاره",
    },
    {
      title: "منطقه برای رزرو",
    },
    {
      title: "رضایت مشتریان ما",
    },
  ],
};

export const HERO_FILTER = {
  options: [
    { title: "رهن و اجاره", value: "rent" },
    { title: "خرید", value: "buy" },
    { title: "فوش ملک", value: "sell" },
    { title: "رزرو ملک", value: "reserve" },
  ],
  search: "جستجو",
};
