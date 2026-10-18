import LogoType from "../logo/logo-type";
import AuthButtons from "./AuthButtons";
import HeaderNav from "./header-nav";

const Header = () => {
  return (
    <header className="w-[88.7%] h-13.75 mt-6 mx-auto flex justify-between">
      <HeaderNav />
      <div className="absolute left-[calc(50%-20px)] -translate-x-1/2">
        <LogoType />
      </div>
      <AuthButtons />
    </header>
  );
};

export default Header;
