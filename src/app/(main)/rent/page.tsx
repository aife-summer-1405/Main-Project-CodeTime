import { FC, Suspense } from "react";
import RentTopSection from "@/components/mortgage-rent/rent-top-section/rent-top-section";
import RentPageList from "@/components/mortgage-rent/rent-page-list/rent-page-list";

type SearchParamsPromise = Promise<Record<string, string | string[] | undefined>>;

type RentPageProps = {
  searchParams: SearchParamsPromise;
};

const page: FC<RentPageProps> = ({ searchParams }) => {
  return (
    <div className="flex flex-col gap-10 h-fit mx-24.25 mt-8 mb-20">
      <RentTopSection />
      <Suspense fallback={<div>در حال بارگذاری لیست...</div>}>
        <RentPageList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default page;