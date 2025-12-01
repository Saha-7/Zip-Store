import logo from "../assets/logo.png";
import FullLogo from "../assets/FullLogo.png";
import Search from "./Search";
import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";


const Header = () => {
  return (
    <header className="h-18 shadow-lg sticky top-0">
      <div className="container flex mx-auto items-center h-full px-1 justify-between">
        {/* Logo */}
        <div className="h-full ">
          <Link to={"/"} className="h-full flex justify-center items-center">
            <img src={logo} alt="logo" className="rounded-lg hidden lg:block" width={70} height={60} />
            <img src={logo} alt="logo" className="rounded-lg lg:hidden" width={60} height={30} />
          </Link>
        </div>
        {/* search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* Login & Cart */}
          <div className="">
            <button className="lg:hidden">
              <FaRegUserCircle  size={26}/>
            </button>
            <div className="hidden lg:block">
              Cart
            </div>
            
          </div>
      </div>
      <div className="mx-auto container px-2 lg:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;
