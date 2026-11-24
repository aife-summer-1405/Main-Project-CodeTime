import RentPageList from "@/components/mortgage-rent/rent-page-list/rent-page-list";
import RentTopSection from "@/components/mortgage-rent/rent-top-section/rent-top-section";
import { getHouses } from "@/lib/Api/house";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="flex flex-col gap-10 h-fit mx-24.25 mt-8 mb-20">
      <Suspense fallback={<div>در حال بارگذاری فیلترها...</div>}>
        <RentTopSection />
      </Suspense>
      <Suspense fallback={<div>در حال بارگذاری...</div>}>
        <RentPageList />
      </Suspense>
    </div>
  );
};

export default page;
