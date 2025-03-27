import { useState, FormEvent } from 'react';
import logo from "../../../assets/main-logo-transparent.svg"
import { ImUserCheck } from "react-icons/im";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function Register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [picture, setPicture] = useState<File | null>(null);

  const HandleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {

      // Validar que todos los campos estén completos
      if (!username && !password && !password2 && !email && !picture) {
        Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
        return;
      }

      // Primero validamos que las contraseñas coincidan
      if (password !== password2) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return;
      }

      // Validar que todos los campos estén completos
      if (!picture) {
        Swal.fire('Error', 'No colocaste tu foto de perfil', 'error');
        return;
      }

      if (!username || !password || !email) {
        let campoFaltante = '';
        if (!username) campoFaltante = 'Username';
        else if (!password) campoFaltante = 'Password';
        else if (!email) campoFaltante = 'Email';

        Swal.fire('Error', `The field ${campoFaltante} is empty`, 'error');
        return;
      }

      // Mostrar carga mientras se procesan las peticiones
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 1. Primero subimos la imagen si existe
      if (picture) {
        const formData = new FormData();
        formData.append('picture', picture);

        const pictureResponse = await fetch('http://localhost:3001/api/auth/profile_picture', {
          method: 'POST',
          body: formData,
        });

        if (!pictureResponse.ok) {
          Swal.fire('Error', 'No se logro subir la imagen', 'error');
          throw new Error('Error al subir la imagen');
        }
        const pictureData = await pictureResponse.json();
        console.log('Imagen subida:', pictureData);
      }

      // 2. Luego registramos al usuario
      const userData = {
        username,
        password,
        email
      };

      const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!registerResponse.ok) {
        throw new Error('Error en el registro');
      }

      const registerData = await registerResponse.json();

      // Mostrar éxito
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada correctamente',
      });

      // Aquí podrías redirigir al usuario o hacer otras acciones post-registro
      console.log('Registro exitoso:', registerData);

    } catch (error) {
      console.error('Error en el registro:', error);
      Swal.fire('Error', 'Hubo un problema durante el registro', 'error');
    }
  };

  const HandlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPicture(file);
    }
  };

  return (
    <div className="registerContainer">
      <form onSubmit={HandleSubmit}>
        <div className='d-flex flex-column justify-content-center mb-3 align-items-center'>
          <img src={logo} alt="logo" id='logo' />
          <label className="form-label text-light fs-4">Profile picture</label>
          <input
            type="file"
            className='form-control'
            accept="image/*"
            onChange={HandlePictureChange}
          />
        </div>

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
              placeholder="Type your password"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary fs-4 mt-3">Register <ImUserCheck /></button>
        <Link to={"/login"} className='fs-3 auth'>I already have an account!</Link>
      </form>

    </div>
  );
}

export default Register;