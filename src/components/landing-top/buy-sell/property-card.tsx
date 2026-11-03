import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  ArrowUpLeft,
  Bath,
  Bed,
  Car,
  MapPin,
  Star,
  TreeDeciduous,
} from "lucide-react";
import Image from "next/image";

const PropertyCard = () => {
  return (
                <Card className="w-85 h-97 text-black-2 cursor-pointer border-2 hover:border-[#0887CA80] border-white-1 shadow-[0px_0px_6px_0px_#0887CA40] bg-white-1 rounded-[32px] p-[8px_7px_8px_7px] flex flex-col items-center">
                  <CardHeader
                    className="relative w-full h-50 overflow-hidden rounded-[24px_24px_4px_4px] p-0 
"
                  >
                    <div className="absolute z-99 bg-linear-[180deg,rgba(6,4,37,0.5)_30%,rgba(6,4,37,0)_100%] size-full flex p-2 text-white-1">
                      <span className="h-fit items-end flex gap-2 font-medium text-sm">
                        4.9
                        <Star />
                      </span>
                      <ArrowUpLeft className="mr-auto" />
                    </div>
                    <Image
                      className="object-cover"
                      src="/images/House1.jpg"
                      alt="Image"
                      fill
                      sizes="324px"
                    />
                  </CardHeader>
                  <CardContent className="w-full px-1 flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-1.5">
                      <h3 className="font-bold text-lg text-blue-1">
                        آپارتمان دوبلکس رامسر
                      </h3>
                      <span className="flex gap-px items-end text-sm text-black-2">
                        <MapPin />
                        رامسر، شهریار 3
                      </span>
                    </div>

                    <div className="w-full border-t border-black-2"></div>

                    <div className="flex flex-col gap-4.25">
                      <div className="flex gap-3 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-1">
                          <Bed />2 خواب
                        </div>
                        <div className="flex gap-1">
                          <Bath />1 حمام
                        </div>
                        <div className="flex gap-1">
                          <Car />1 پارکینگ
                        </div>
                        <div className="flex gap-1">
                          <TreeDeciduous /> حیاط
                        </div>
                      </div>
                      <div className="font-bold text-blue-3 text-base">
                        <span>250,000,000</span>
                        <span> تومان</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  )
}

export default PropertyCard