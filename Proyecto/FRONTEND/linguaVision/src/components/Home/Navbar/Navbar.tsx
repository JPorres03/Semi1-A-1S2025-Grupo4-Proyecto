import logo from "../../../assets/logo.webp";
import { FaCloudUploadAlt } from "react-icons/fa";
import { LuFiles } from "react-icons/lu";
import { CgLogOut } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface NavbarProps {
  onNavClick: (option: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      sessionStorage.clear();
      await Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente",
        timer: 1500,
        showConfirmButton: false
      });
      navigate("/login");
    }
  };

  return (
    <nav className="container-navbar">
      <h1 className="mt-3 mx-3">
        <img src={logo} alt="logo" />
        LinguaVision
      </h1>
      <div className="navbar-buttons">
        <button
          type="button"
          className="btn mx-3 fs-4"
          onClick={() => {
            onNavClick("upload");
          }}
        >
          Upload <FaCloudUploadAlt />
        </button>
        <button
          type="button"
          className="btn mx-3 fs-4"
          onClick={() => {
            onNavClick("files");
          }}
        >
          Files <LuFiles />
        </button>
        <button type="button" className="btn mx-3 fs-4" onClick={handleLogout}>
          Logout <CgLogOut />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
