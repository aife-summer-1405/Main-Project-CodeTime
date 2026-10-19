import { HERO_CONTENT } from "@/constants/hero-section";
import { Button } from "../ui/button";
import Link from "next/link";

const HeroContent = () => {
  return (
    <div className="w-130.5 h-93.5 mt-11.5">
      <h1 className="text-[50px] font-black w-[320px] text-black-2 dark:text-white-1 mb-9">
        {HERO_CONTENT.title.title1}
        <span className="text-green-1"> {HERO_CONTENT.title.title2} </span>
        {HERO_CONTENT.title.title3}
      </h1>
      <div className="flex gap-4 font-bold">
        {HERO_CONTENT.buttons.map((item) => (
          <Button
            key={item.href}
            className={`${item.classname} h-fit px-5 py-3`}
            variant={item.variant}
            render={<Link href={item.href} />}
            nativeButton = {false}
          >
            {item.title}
          </Button>
        ))}
      </div>
      <div className="flex gap-18 mt-13.75">
        {HERO_CONTENT.info.map((item) => (
          <div key={item.title}>
            <div className="font-bold relative pt-2.75 pr-2.75">
              <span className="text-xl text-blue-1 dark:text-blue-4 absolute top-0 right-0">
                +
              </span>
              <span className="text-[32px] text-black-2/90 dark:text-white-1/85">266</span>
            </div>
            <span className="font-medium text-black-2/80 dark:text-white-1/50">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroContent;
