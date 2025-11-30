import logo from "../assets/logo.png";
import FullLogo from "../assets/FullLogo.png";
import Search from "./Search";

const Header = () => {
  return (
    <header className="h-20 shadow-lg sticky top-0">
      <div className="container flex mx-auto items-center h-full px-1 justify-between">
        {/* Logo */}
        <div className="h-full ">
          <div className="h-full flex justify-center items-center">
            <img src={logo} alt="logo" className="rounded-lg hidden lg:block" width={80} height={60} />
            <img src={logo} alt="logo" className="rounded-lg lg:hidden" width={60} height={30} />
          </div>
        </div>
        {/* search */}
          <div>
            <Search />
          </div>

          {/* Login & Cart */}
          <div>
            Login & Cart
          </div>
      </div>
    </header>
  );
};

export default Header;
