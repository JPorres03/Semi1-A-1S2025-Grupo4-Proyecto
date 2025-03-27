import { useState, FormEvent } from 'react';
import img from "../../../assets/space1.jpg"
import logo from "../../../assets/main-logo-transparent.svg"
import { RiLoginBoxFill } from "react-icons/ri";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para controlar la visibilidad de la contraseña

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    try {

      // Validar que todos los campos estén completos
      if (!username || !password) {
        let campoFaltante = '';
        if (!username) campoFaltante = 'Nombre de usuario';
        else if (!password) campoFaltante = 'Contraseña';

        Swal.fire('Error', `El campo ${campoFaltante} es obligatorio`, 'error');
        return;
      }

      // Mostrar carga mientras se procesan las peticiones
      Swal.fire({
        title: 'Procesando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const userData = {
        username,
        password,
      };

      const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!loginResponse.ok) {
        throw new Error('Error en el login');
      }

      const loginData = await loginResponse.json();

      // Mostrar éxito
      Swal.fire({
        icon: 'success',
        title: 'Login exitoso',
        text: 'Bienvenido de nuevo!',
        showConfirmButton: false,
        timer: 1500
      });

      // Aquí podrías redirigir al usuario o hacer otras acciones post-registro
      console.log('Login exitoso:', loginData);


    } catch (error) {
      console.error('Error en el login:', error);
      Swal.fire('Error', 'Hubo un problema durante el login', 'error');
    }

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
            type={showPassword ? "text" : "password"} // Cambia el tipo según el estado
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password"
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input bg-dark"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)} // Actualiza el estado cuando el checkbox cambia
          />
          <label className="form-check-label text-light">Show password</label>
        </div>
        <button type="submit" className="btn btn-primary fs-4"><RiLoginBoxFill /> Login</button>
        <Link to={"/register"} className='mt-3 fs-4 auth' >Don't have an account?</Link>
      </form>
      <img src={img} alt="space image 1" />
    </div>
  );
}

export default Login;