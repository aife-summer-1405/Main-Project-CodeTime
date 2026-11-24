import { Home, LogIn, MapPin, Settings } from "lucide-react";

export const HEADER_LINKS = [
  {
    title: "صفحه اصلی",
    href: "/",
    matches: ["/"],
  },
  {
    title: "رزرو سریع",
    href: "/reserve",
    matches: ["/reserve"],
  },
  {
    title: "رهن و اجاره",
    href: "/rent",
    matches: ["/rent", "/mortgage"],
  },
  {
    title: "وبلاگ",
    href: "/blog",
    matches: ["/blog"],
  },
  {
    title: "درباره ما",
    href: "/contact-us",
    matches: ["/contact-us"],
  },
] as const;

export const isHeaderLinkActive = (
  pathname: string,
  item: { href: string; matches?: readonly string[] },
) => {
  const bases = item.matches ?? [item.href];
  return bases.some((base) =>
    base === "/"
      ? pathname === "/"
      : pathname === base || pathname.startsWith(`${base}/`),
  );
};

export const HEADER_TEXTS = {
  login: "ورود",
  register: "ثبت‌نام",
} as const;