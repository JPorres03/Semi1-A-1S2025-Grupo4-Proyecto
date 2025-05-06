import logo from "../../../assets/logo.webp";
import { CgLogOut } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { AiFillPicture } from "react-icons/ai";
import { HiLanguage } from "react-icons/hi2";
import { RiVoiceAiLine } from "react-icons/ri";
import { MdTranscribe } from "react-icons/md";
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
			reverseButtons: true,
		});

		if (result.isConfirmed) {
			sessionStorage.clear();
			await Swal.fire({
				icon: "success",
				title: "Sesión cerrada",
				text: "Has cerrado sesión correctamente",
				timer: 1500,
				showConfirmButton: false,
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
						onNavClick("rekognition");
					}}
				>
					Rekognition <AiFillPicture />
				</button>
				<button
					type="button"
					className="btn mx-3 fs-4"
					onClick={() => {
						onNavClick("translate");
					}}
				>
					Translate <HiLanguage />
				</button>
        <button
					type="button"
					className="btn mx-3 fs-4"
					onClick={() => {
						onNavClick("polly");
					}}
				>
					Polly <RiVoiceAiLine />
				</button>
        <button
					type="button"
					className="btn mx-3 fs-4"
					onClick={() => {
						onNavClick("transcribe");
					}}
				>
					Transcribe <MdTranscribe />
				</button>
				<button type="button" className="btn mx-3 fs-4" onClick={handleLogout}>
					Logout <CgLogOut />
				</button>
			</div>
		</nav>
	);
};

export default Navbar;
