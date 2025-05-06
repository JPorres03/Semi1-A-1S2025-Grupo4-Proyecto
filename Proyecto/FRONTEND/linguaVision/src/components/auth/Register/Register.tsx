import img from "../../../assets/flags2.webp";
import logo from "../../../assets/logo.webp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosCreate } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Función para registrar al usuario
  const register = async (username: string, email: string, password: string) => {
    const response = await fetch("http://BalanceadorProyecto1-402882467.us-east-1.elb.amazonaws.com:80/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    const data = await response.json();
    // Guarda los datos del usuario en sessionStorage
    sessionStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Error en el registro");
      } else {
        setError("Error en el registro");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-register">
      <img src={img} alt="flags" className="register-background" />
      <form onSubmit={handleRegister} className="container-register-form">
        <h1 className="mt-3 d-flex align-items-center justify-content-center">
          <img src={logo} alt="logo" className="me-2" />
          LinguaVision
        </h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3 w-75">
          <label className="form-label fs-3" htmlFor="username">
            Username:
          </label>
          <input
            id="username"
            type="text"
            className="form-control"
            placeholder="Type your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 w-75">
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

        <div className="mb-3 w-75">
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
            minLength={6}
          />
        </div>

        <div className="d-flex justify-content-around align-items-center w-100">
          <button
            className="btn w-25 fs-5 btn-login"
            type="button"
            onClick={() => navigate("/login")}
            disabled={isLoading}
          >
            <IoArrowBack /> Login
          </button>
          <button 
            className="btn w-25 fs-5 btn-register" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <>
                Register <IoIosCreate />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
