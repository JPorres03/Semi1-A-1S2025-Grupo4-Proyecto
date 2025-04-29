import { useState } from "react";
import { useApi } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
import logo from "../../../assets/logo.webp";
import { IoArrowBack } from "react-icons/io5";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login, isAuthenticated } = useApi();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await login(email, password);
			navigate("/"); // Redirige al dashboard después de login
		} catch (err) {
			setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
		}
	};

	if (isAuthenticated) {
		navigate("/"); // Si ya está autenticado, redirige
		return null;
	}

	return (
		<div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-login">
			{error && <div className="error-message">{error}</div>}
			<form
				onSubmit={handleSubmit}
				className="container bg-login-form w-50 border border-1 rounded p-4 shadow"
			>
				<h1 className="mt-3">
					<img src={logo} alt="" />
					LinguaVision
				</h1>
				<div className="mb-3">
					<label className="form-label fs-3" htmlFor="email">
						Email:
					</label>
					<input
						id="email"
						type="email"
						className="form-control"
						placeholder="Type your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label fs-3" htmlFor="password">
						Password:
					</label>
					<input
						id="password"
						type="password"
						className="form-control"
						placeholder="Type your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="d-flex justify-content-around align-items-center">
					<button className="btn w-25 fs-5 btn-register" type="button" onClick={() => navigate("/register")}>
                    <IoArrowBack /> Register
                    </button>
					<button className="btn w-25 fs-5 btn-login" type="submit">
                    <IoLogIn /> Login
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
