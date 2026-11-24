import { getHouses, house } from "@/lib/Api/house";
import RentCard from "../rent-card/rent-card";

const RentPageList = async () => {
  const houses: house[] = await getHouses();
  return (
    <div className="h-fit min-h-114">
      <div className="flex flex-wrap gap-6 max-w-312 mx-auto">
        {houses.map((house) => (
          <RentCard key={house.id} house={house} />
        ))}
      </div>
    </div>
  );
};

export default RentPageList;
