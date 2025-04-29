import logo from "../../../assets/logo.webp";
import { FaCloudUploadAlt } from "react-icons/fa";
import { LuFiles } from "react-icons/lu";
import { CgLogOut } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onNavClick: (option: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const navigate = useNavigate();

	return (
		<nav className="container-navbar">
			<h1 className="mt-3 mx-3">
				<img src={logo} alt="logo" />
				LinguaVision
			</h1>
			<div className="navbar-buttons">
        <button type="button" className="btn mx-3 fs-4" onClick={() => {onNavClick('upload')}}>
          Upload <FaCloudUploadAlt />
        </button>
        <button type="button" className="btn mx-3 fs-4" onClick={() => {onNavClick('files')}}>
          Files <LuFiles />
        </button>
        <button type="button" className="btn mx-3 fs-4" onClick={() => {navigate('/login')}}>
          Logout <CgLogOut />
        </button>
      </div>
		</nav>
	);
}

export default Navbar;
