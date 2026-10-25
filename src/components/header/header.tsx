import LogoType from "../logo/logo-type";
import AuthButtons from "./AuthButtons";
import HeaderNav from "./header-nav";

const Header = () => {
  return (
    <header className="w-[88.7%] max-md:w-[95%] h-13.75 max-sm:h-10 mt-6 max-md:mt-5 mx-auto flex justify-between">
      <HeaderNav />
      <div className=" absolute left-[calc(50%-20px)] max-md:left-[calc(50%)] -translate-x-1/2">
        <LogoType className="max-lg:text-xl!"/>
      </div>
      <AuthButtons />
    </header>
  );
};

export default Header;
