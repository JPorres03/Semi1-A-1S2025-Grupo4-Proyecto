import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoLogIn, IoArrowBack } from "react-icons/io5";
import logo from "../../../assets/logo.webp";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const response = await fetch("http://BalanceadorProyecto1-402882467.us-east-1.elb.amazonaws.com:80/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Credenciales incorrectas");
    }

    const data = await response.json();
    sessionStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      await Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido de nuevo",
        timer: 2000,
        showConfirmButton: false
      });
      navigate("/");
    } catch (err: unknown) {
      let message = "Error desconocido";
      if (err instanceof Error) {
        message = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-login">
      <form
        onSubmit={handleSubmit}
        className="container bg-login-form w-50 border border-1 rounded p-4 shadow"
      >
        <h1 className="mt-3 d-flex align-items-center justify-content-center">
          <img src={logo} alt="logo" className="me-2" />
          LinguaVision
        </h1>

        <div className="mb-3 mt-4">
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

        <div className="d-flex justify-content-around align-items-center mt-4">
          <button
            className="btn w-25 fs-5 btn-register"
            type="button"
            onClick={() => navigate("/register")}
            disabled={isLoading}
          >
            <IoArrowBack /> Register
          </button>
          <button className="btn w-25 fs-5 btn-login" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <>
                <IoLogIn /> Login
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
