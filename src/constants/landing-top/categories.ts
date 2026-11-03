import {
  Apartment,
  ApartmentDark,
  Office,
  OfficeDark,
  Store,
  storeDark,
  SwimmingPool,
  SwimmingPoolDark,
  Villa,
  VillaDark,
} from "@/components/svgs/category";

export const LANDING_CATEGORIES = [
  {
    title: "مغازه",
    describe: "طراحی دقیق ، کیفیت بی نظیر",
    icon: Store,
    iconDark: storeDark,
  },
  {
    title: "آپارتمان",
    describe: "طراحی دقیق ، کیفیت بی نظیر",
    icon: Apartment,
    iconDark: ApartmentDark,
  },
  {
    title: "ویلایی",
    describe: "ویلای مدرن، زندگی متفاوت",
    icon: Villa,
    iconDark: VillaDark,
  },
  {
    title: "اداری",
    describe: "طراحی دقیق ، کیفیت بی نظیر",
    icon: Office,
    iconDark: OfficeDark,
  },
  {
    title: "استخر دار",
    describe: "طراحی دقیق ، کیفیت بی نظیر",
    icon: SwimmingPool,
    iconDark: SwimmingPoolDark,
  },
];
