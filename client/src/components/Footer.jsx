import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t-gray-400  text-black">
      <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between">
        <p>© Zip-Store copyright reserved [Pritam Saha] [2025]</p>
      
      <div className="flex items-center justify-center gap-4 text-lg cursor-pointer">
        <a href="" className="hover:text-primary-100">
          <FaInstagram />
        </a>
        <a className="hover:text-primary-100">
          <FaFacebook />
        </a>
        <a className="hover:text-primary-100">
          <FaLinkedin />
        </a>
        <a className="hover:text-primary-100">
          <FaXTwitter />
        </a>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
