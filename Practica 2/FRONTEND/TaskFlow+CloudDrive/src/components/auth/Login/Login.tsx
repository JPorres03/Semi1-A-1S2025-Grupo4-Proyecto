import { useState, FormEvent } from 'react';
import img from "../../../assets/space1.jpg"
import logo from "../../../assets/main-logo-transparent.svg"
import { RiLoginBoxFill } from "react-icons/ri";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault(); // Evita que el formulario recargue la página
    console.log("Username:", username, "Password:", password);
    // Aquí iría tu lógica de autenticación (API call, etc.)
  }

  return (
    <div className="loginContainer">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="logo" id='logo' />
        <div className='mb-3'>
          <label className="form-label text-light fs-3">Username</label>
          <input
            className='form-control'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Type your username"
          />
        </div>
        <div className='mb-3'>
          <label className="form-label text-light fs-3">Password</label>
          <input
            className='form-control'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password"
          />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input bg-dark" />
          <label className="form-check-label text-light">Review password</label>
        </div>
        <button type="submit" className="btn btn-primary fs-4"><RiLoginBoxFill /> Login</button>
      </form>
      <img src={img} alt="space image 1" />
    </div>
  );
}

export default Login;