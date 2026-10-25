import { HERO_FILTER } from "@/constants/hero-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ReserveForm from "./forms/reserve-form";
import { Underline2 } from "../svgs/nav-underline";

const HeroFilter = () => {
  return (
    <div className="text-black-2 absolute left-38.75 bottom-20 w-255 h-35 rounded-[8px_64px_8px_64px] shadow-[8px_0px_20px_0px_#0887CA4D] bg-white-1">
      <Tabs defaultValue={HERO_FILTER.options[3].value} className="w-full">
        <TabsList
          className={"w-fit p-0 mt-2 mb-5.5 mx-auto gap-7 dark:bg-white-1"}
        >
          {HERO_FILTER.options.map((item) => (
            <TabsTrigger
              className={
                "group w-fit p-0 flex flex-col dark:data-active:text-blue-2 data-active:text-blue-2 data-active:hover:text-blue-2 data-active:text-base data-active:font-bold  dark:text-black-2 dark:hover:text-black-2 text-sm font-medium text-black-2 cursor-pointer"
              }
              key={item.value}
              
              value={item.value}
            >
              {item.title}
              <div aria-hidden="true" className="absolute -bottom-2 opacity-0  group-data-active:opacity-100 transition-opacity duration-300"> 
                <Underline2 />
              </div>
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
