import { Suspense } from "react";
import LogoType from "../logo/logo-type";
import AuthButtons from "./AuthButtons";
import HeaderNav from "./header-nav";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <>
      <header className="w-[88.7%] h-13.75 mt-6 mx-auto flex justify-between">
        <div className="hidden lg:block">
          <Suspense fallback={null}><HeaderNav /></Suspense>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 lg:left-[calc(50%-20px)]">
          <LogoType />
        </div>
        <div className="hidden lg:block">
          <AuthButtons />
        </div>
      </header>
      <Suspense fallback={null}><MobileNav /></Suspense>
    </>
  );
};

export default Header;