"use client";
import { HEADER_LINKS } from "@/constants/header";
import {NavUnderline} from "../svgs/nav-underline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {HEADER_LINKS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <NavigationMenuItem key={item.title}>
              <div className="relative flex flex-col items-center">
                <NavigationMenuLink
                  className={`text-black-1 dark:text-white-1 font-medium text-base
                      focus:bg-transparent hover:bg-transparent
                      transition-all duration-300
                      ${
                        isActive
                          ? "-translate-y-1 opacity-100 text-blue-3 text-lg font-bold"
                          : "opacity-80"
                      }`}
                  render={<Link href={item.href} />}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.title}
                </NavigationMenuLink>

                <div
                  aria-hidden="true"
                  className={`pointer-events-none relative -top-3 pt-1
                      transition-opacity duration-300 -translate-y-1 
                      ${isActive ? "opacity-100" : "opacity-0"}`}
                >
                  <NavUnderline/>
                </div>
              </div>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default HeaderNav;
