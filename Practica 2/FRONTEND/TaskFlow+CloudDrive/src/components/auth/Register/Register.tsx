import { useState, FormEvent } from 'react';
import logo from "../../../assets/main-logo-transparent.svg"
import { ImUserCheck } from "react-icons/im";

function Register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');

  function HandleSubmit(e: FormEvent) {
    e.preventDefault(); // Evita que el formulario recargue la página
    console.log("Username:", username, "Password:", password, "Email:", email);
    // Aquí iría tu lógica de autenticación (API call, etc.)
  }

  return (
    <div className="registerContainer">
      <form onSubmit={HandleSubmit}>
        <img src={logo} alt="logo" id='logo' />
        <div className='d-flex justify-content-between mb-3'>
          <div className='mx-3'>
            <label className="form-label text-light fs-4">Username</label>
            <input
              className='form-control'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Type your username"
            />
          </div>
          <div>
            <label className="form-label text-light fs-4">Email</label>
            <input
              className='form-control'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email"
            />
          </div>
        </div>

        <div className='d-flex justify-content-between mb-3'>
          <div className='mx-3'>
            <label className="form-label text-light fs-4">Password</label>
            <input
              className='form-control'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password"
            />
          </div>
          <div>
            <label className="form-label text-light fs-4">Confirm password</label>
            <input
              className='form-control'
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Type your password again"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary fs-4 mt-3">Register <ImUserCheck /></button>
      </form>

    </div>
  );
}

export default Register;