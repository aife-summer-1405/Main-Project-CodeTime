"use client";

import dynamic from "next/dynamic";

const HeroMedia = dynamic(() => import("./hero-media"), {
  ssr: false,
  loading: () => <div className="h-96 max-lg:h-901" />,
});

export default HeroMedia;