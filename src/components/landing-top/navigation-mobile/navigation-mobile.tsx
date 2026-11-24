"use client";

import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { NavUnderlineMobile } from "@/components/svgs/underline";
import { MOBILE_NAV } from "@/constants/header";

const NavigationMobile = () => {
  const pathname = usePathname();
  
  return (
    <NavigationMenu className={" bg-black-2 rounded-[16px]"}>
      <NavigationMenuList
        className={"flex flex-row-reverse justify-evenly gap-6 w-86.25 h-14 max-lg:gap-4 max-md:gap-3"}
      >

        {MOBILE_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <NavigationMenuItem key={item.href}>
              <div className="relative flex flex-col items-center w-fit">
                <NavigationMenuLink
                  className={`text-white-1 dark:text-white-1
                      focus:bg-transparent hover:bg-transparent
                      transition-all duration-300 p-0 
                      ${
                        isActive
                          ? "translate-y-1 opacity-100 text-white-1 dark:text-white-1"
                          : "opacity-80"
                      }`}
                  render={<Link href={item.href} />}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="size-8"/>
                </NavigationMenuLink>

                <div
                  aria-hidden="true"
                  className={`pointer-events-none relative -top-3 pt-1
                      transition-opacity duration-300 translate-y-4
                      ${isActive ? "opacity-100 block" : "opacity-0 hidden"}`}
                >
                  <NavUnderlineMobile/>
                </div>
              </div>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMobile;
