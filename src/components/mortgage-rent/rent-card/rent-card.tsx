import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { house } from "@/lib/Api/house";
import { Bath, Bed, Car, MapPin, Star, TreeDeciduous } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
interface IProps {
  house: house;
}

const RentCard: FC<IProps> = ({ house }) => {
  const formatedPrice = house.price.toLocaleString();
  return (
    <Card className="bg-white-1 dark:bg-black-1 w-153 py-2 pr-2 shadow-[0px_0px_6px_0px_#0887CA40] dark:shadow-none rounded-[32px]">
      <div className="h-50 flex gap-2">
        <CardHeader className="p-0 relative w-63.5 h-50 rounded-[16px] overflow-hidden">
          <Image
            className="w-63.5! h-50!"
            width={254}
            height={200}
            src={house.photos?.[0] || "/images/House1.jpg"}
            alt="rent property"
          />
          <span className="absolute top-3 right-2 text-white-1 z-99 flex items-center gap-1">
            {house.rate}
            <Star />
          </span>
          <div className="absolute top-0 z-90 size-full background: bg-linear-[180deg,rgba(6,4,37,0.5)_30%,rgba(6,4,37,0)_100%]"></div>
        </CardHeader>
        <CardContent className="mt-4.75 w-81.25 p-2 h-40.5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg font-bold text-black-2 truncate">
                {house.title}
              </h2>
              <h3 className="flex items-center gap-1 h-6 overflow-hidden">
                <MapPin />
                <span className="truncate">{house.address}</span>
              </h3>
            </div>
            <div className="border-b w-full border-black-2"></div>
            <div className="flex flex-col gap-4.25">
              <div className="flex gap-3 text-sm font-medium whitespace-nowrap">
                <div className="flex gap-1">
                  <Bed />
                  {house.rooms} خواب
                </div>
                <div className="flex gap-1">
                  <Bath />
                  {house.bathrooms} حمام
                </div>
                <div className="flex gap-1">
                  <Car />
                  {house.parking !== 0
                    ? `${house.parking} پارکینگ`
                    : "بدون پارکینگ"}{" "}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-base text-blue-3">
                  {formatedPrice} تومان
                </span>
                <Button
                  className={
                    "border-blue-3/50 dark:border-blue-4  text-blue-3/50 dark:text-blue-4 rounded-[8px] hover:border-blue-3 hover:text-blue-3"
                  }
                  variant={"outline"}
                >
                  مشاهده ملک
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RentCard;
