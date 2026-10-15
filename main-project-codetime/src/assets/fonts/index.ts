import localFont from "next/font/local";

export const iranSans = localFont({
  src: [
    {
      path: "./IRANSansWeb_Light_FaNum.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./IRANSansWeb_FaNum.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./IRANSansWeb_Medium_FaNum.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./IRANSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./IRANSansWeb_Bold_FaNum.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});

export const logoFont = localFont({
  src: "./Far.Afaaq.ttf",
  variable: "--font-logo",
  display: "swap",
});
