import { Filter, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const HeroFilterMobile = () => {
  return (
    <div className="lg:hidden relative w-full max-w-86.25">
      <Search className="absolute size-5 top-3.5 right-4" />
      <Input placeholder="جستجوی خانه ..." className="w-full h-12 bg-[#DEDDE1] indent-10.5 text-xs!" />
      <Popover>
        <PopoverTrigger className={"absolute left-2 top-2 flex items-center justify-center cursor-pointer bg-black-2 text-white-1 size-8 rounded-[8px]"}>
          <Filter className="size-5" />
        </PopoverTrigger>
        <PopoverContent className={"w-fit"}></PopoverContent>
      </Popover>
    </div>
  );
};

export default HeroFilterMobile;