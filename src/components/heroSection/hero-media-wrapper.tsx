"use client";

import dynamic from "next/dynamic";

const HeroMedia = dynamic(() => import("./hero-media"), {
  ssr: false,
  loading: () => <div className="h-96" />,
});

export default HeroMedia;