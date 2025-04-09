import { useState, type FormEvent, useRef } from 'react';
import logo from "../../../assets/main-logo-transparent.svg"
import { ImUserCheck } from "react-icons/im";
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64String = reader.result as string;
        // Extraer solo la parte base64 removiendo el prefijo "data:image/xxx;base64,"
        const commaIndex = base64String.indexOf(',');
        if (commaIndex !== -1) {
          base64String = base64String.substring(commaIndex + 1);
        }
        setProfilePicture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const HandleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Validar que todos los campos estén completos
      if (!username || !password || !confirm_password || !email) {
        let campoFaltante = '';
        if (!username) campoFaltante = 'Username';
        else if (!password) campoFaltante = 'Password';
        else if (!confirm_password) campoFaltante = 'Confirm Password';
        else if (!email) campoFaltante = 'Email';

        Swal.fire('Error', `The field ${campoFaltante} is empty`, 'error');
        return;
      }

      // Validar que las contraseñas coincidan
      if (password !== confirm_password) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
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

      const userData = {
        username,
        email,
        password,
        confirm_password
      };

      const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const registerData = await registerResponse.json();

      // Si no se seleccionó imagen, usar una por defecto o no enviar
      const imageToSend = profilePicture || 'imagen_por_defecto_en_base64';

      console.log('Imagen a enviar:', imageToSend);

      const profileResponse = await fetch('https://tdnnd19hzb.execute-api.us-east-1.amazonaws.com/default/Lambda1_pra1', {
        method: 'POST',    
        body: JSON.stringify({ 
          id_usuario: registerData.user.id,
          imagen_base64: imageToSend,
          nombre_archivo: `profile_${registerData.user.id}.png`, 
        }),
      });

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        console.log('Error en la carga de la imagen:', errorData.message || 'Error en la carga de la imagen');
      }

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada correctamente',
      });

      sessionStorage.setItem('userId', registerData.user.id);

      console.log('Registro exitoso:', registerData);

      navigate('/');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Hubo un problema durante el registro';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  return (
    <div className="registerContainer">
      <form onSubmit={HandleSubmit}>
        <div className='d-flex flex-column justify-content-center mb-3 align-items-center'>
          <img src={logo} alt="logo" id='logo' />
          <label htmlFor="profilePicture" className="form-label text-light fs-4">Profile picture</label>
          <input
            id="profilePicture"
            ref={fileInputRef}
            type="file"
            className='form-control'
            accept="image/*"
            onChange={handleImageChange}
          />
          {profilePicture && (
            <img 
              src={profilePicture} 
              alt="Preview" 
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }} 
            />
          )}
        </div>

        <div className='d-flex justify-content-between mb-3'>
          <div className='mx-3'>
            <label htmlFor="username" className="form-label text-light fs-4">Username</label>
            <input
              id="username"
              className='form-control'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Type your username"
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label text-light fs-4">Email</label>
            <input
              id="email"
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
            <label htmlFor="password" className="form-label text-light fs-4">Password</label>
            <input
              id="password"
              className='form-control'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="form-label text-light fs-4">Confirm password</label>
            <input
              id="confirmPassword"
              className='form-control'
              type="password"
              value={confirm_password}
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