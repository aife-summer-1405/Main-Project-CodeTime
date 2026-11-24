import RentMainFilterForm from "./forms/rent-main-filter-form";
import RentRangeFilterForm from "./forms/rent-range-filter-form";

const RentTopSection = () => {
  return (
    <div className="flex flex-col">
      <RentMainFilterForm />
      <div className="h-15.25 border border-blue-1 mb-8"></div>
      <div className="h-22 border-t border-b border-blue-3/20 flex items-center justify-center">
      <RentRangeFilterForm />
      </div>
      <div className="h-8 hidden"></div>
    </div>
  );
};

export default RentTopSection;
