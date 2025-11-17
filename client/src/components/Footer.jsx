import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="border-t-gray-400 h-10 text-black">
      <div className="container mx-auto p-4 text-center flex flex-col gap-2">
        <p>© Zip-Store copyright reserved [Pritam Saha] [2025]</p>
      </div>
      <div className="flex items-center justify-center gap-4 text-lg cursor-pointer">
        <a><FaInstagram /></a>
        <a><FaFacebook /></a>
        <a><FaLinkedin/></a>
        <a><FaXTwitter/></a>
      </div>
    </footer>
  );
};

export default Footer;
