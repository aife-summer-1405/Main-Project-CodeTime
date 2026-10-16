import LogoType from "../logo/logo-type";
import AuthButtons from "./AuthButtons";
import HeaderNav from "./header-nav";

const Header = () => {
  return (
    <header className="w-[90%] h-13.75 mt-6 mx-auto flex justify-between">
      <HeaderNav/>
      <LogoType/>
      <AuthButtons/>
    </header>
  );
};

export default Header;
