import { LANDING_CATEGORIES } from "@/constants/landing-top/categories";
import LandingTitle from "../landing-titles";

const Categories = () => {
  return (
    <div>
      <div className="text-center items-center flex flex-col gap-2 mb-4.25">
        <LandingTitle emoji="?" text="به دنبال چه نوع خونه ای هستی هر چی بخوای ما داریم"/>
        <h2 className="font-bold text-blue-1">برترین دسته بندی های ما</h2>
      </div>

      <div className="flex gap-22 h-52">
        {LANDING_CATEGORIES.map((item) => (
          <div
            key={item.title}
            className="w-40 h-40 hover:shadow-[0px_2px_8px_0px_#005EA480] rounded-[8px] text-center flex flex-col gap-2 items-center cursor-pointer"
          >
            <div className="size-10"></div>
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="text-sm font-medium w-33">{item.describe}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
