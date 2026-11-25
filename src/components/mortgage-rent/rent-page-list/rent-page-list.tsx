import { getRentHouses, type RentHouse, type RentQuery } from "@/lib/Api/rent";
import RentCard from "../rent-card/rent-card";

type RentPageListProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const getFirstValue = (
  val: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(val)) return val[0];
  return val;
};

const RentPageList = async ({ searchParams }: RentPageListProps) => {
  const resolvedParams = await searchParams;

  const query: RentQuery = {
    page: 1,
    limit: 10,
    transactionType: "rental",
    sort: "newest",
    location: "",
    category: "",
    search: getFirstValue(resolvedParams.search) ?? "",
    minPrice: getFirstValue(resolvedParams.minPrice) ?? "",
    maxPrice: getFirstValue(resolvedParams.maxPrice) ?? "",
    minArea: getFirstValue(resolvedParams.minArea) ?? "",
    maxArea: getFirstValue(resolvedParams.maxArea) ?? "",
    minRent: getFirstValue(resolvedParams.minRent) ?? "",
    maxRent: getFirstValue(resolvedParams.maxRent) ?? "",
  };

  const { houses }: { houses: RentHouse[] } = await getRentHouses(query);

  return (
    <div className="h-fit min-h-114">
      <div className="flex flex-wrap gap-6 max-w-312 mx-auto relative z-10">
        {houses.map((house) => (
          <RentCard key={house.id} house={house} />
        ))}
      </div>
    </div>
  );
};

export default RentPageList;