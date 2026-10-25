import { LANDING_CATEGORIES } from "@/constants/landing-top/categories";
import LandingTitle from "../landing-titles";
import { Store } from "@/components/svgs/category";

const Categories = () => {
  return (
    <div className="mx-auto">
      <div className="text-center items-center flex flex-col gap-2 mb-4.25">
        <LandingTitle
          className="dark:text-blue-4"
          emoji="?"
          text="به دنبال چه نوع خونه ای هستی هر چی بخوای ما داریم"
        />
        <h2 className="font-bold text-blue-1 dark:text-white-1">
          برترین دسته بندی های ما
        </h2>
      </div>

      <div className="flex gap-22">
        {LANDING_CATEGORIES.map((item, index) => {
          const Icon = item.icon;
          const IconDark = item.iconDark;
          return (
            <div
              key={item.title}
              className={`w-40 h-40 hover:shadow-[0px_2px_8px_0px_#005EA480] rounded-[8px] text-center flex flex-col gap-2 items-center justify-center cursor-pointer dark:hover:bg-black-2
            ${index === 2 ? "translate-y-12" : ""}
            ${index === 1 || index === 3 ? "translate-y-8" : ""}`}
            >
              <span className="block dark:hidden">
                <Icon />
              </span>

              <span className="hidden dark:block">
                <IconDark />
              </span>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm font-medium w-33">{item.describe}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
