import { Home, LogIn, MapPin, Settings } from "lucide-react";

export const HEADER_LINKS = [
  {
    title: "صفحه اصلی",
    href: "/",
  },
  {
    title: "رزور سریع",
    href: "/reserve",
  },
  {
    title: "وبلاگ",
    href: "/blog",
  },
  {
    title: "درباره ما",
    href: "/about-us",
  },
] as const;

export const MOBILE_NAV = [
  {
    icon: Home,
    href: "/",
  },
  {
    icon: MapPin,
    href: "/reserve",
  },
  {
    icon: Settings,
    href: "/setting",
  },
  {
    icon: LogIn,
    href: "/login",
  },
];

export const HEADER_TEXTS = {
  login: "ورود",
  register: "ثبت‌نام",
} as const;
