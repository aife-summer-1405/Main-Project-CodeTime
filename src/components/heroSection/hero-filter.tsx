import { HERO_FILTER } from "@/constants/hero-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ReserveForm from "./forms/reserve-form";

const HeroFilter = () => {
  return (
    <div className="absolute left-38.75 bottom-20 w-255 h-35 rounded-[8px_64px_8px_64px] shadow-[8px_0px_20px_0px_#0887CA4D] bg-white-1">
      <Tabs defaultValue={HERO_FILTER.options[3].value} className="w-full">
        <TabsList className={"flex w-fit p-0 mt-2 mb-5.5 mx-auto gap-7"}>
          {HERO_FILTER.options.map((item) => (
            <TabsTrigger
              className={
                "data-active:text-blue-2 data-active:text-base data-active:font-bold  text-sm font-medium text-black-2 cursor-pointer focu"
              }
              key={item.value}
              value={item.value}
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {HERO_FILTER.options.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {item.value === "reserve" && <ReserveForm />}

            {item.value === "sell" && <div>فرم فروش ملک</div>}
            {item.value === "buy" && <div>فرم خرید ملک</div>}

            {item.value === "rent" && <div>فرم اجاره ملک</div>}
          </TabsContent>
        ))}
      </Tabs>
      <div></div>
    </div>
  );
};

export default HeroFilter;
