import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { endpoint } from '../../main';

function Register() {
    const [nombres, setNombres] = useState<string>('');
    const [apellidos, setApellidos] = useState<string>('');
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null); // Cambiado a File para almacenar la imagen
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [fechaNacimiento, setFechaNacimiento] = useState<string>('');
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFotoPerfil(file); // Guardar el archivo de imagen
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas
        if (!nombres || !apellidos || !email || !password || !confirmPassword || !fechaNacimiento || !fotoPerfil) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
            });
            return;
        }

        // Crear un FormData para enviar los datos del formulario
        const formData = new FormData();
        formData.append('nombres', nombres);
        formData.append('apellidos', apellidos);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('rol', 'usuario'); // Asignar el rol de usuario por defecto
        formData.append('fecha_nacimiento', fechaNacimiento);
        if (fotoPerfil) {
            formData.append('foto_perfil', fotoPerfil); // Agregar la imagen como archivo
        }

        try {
            const response = await fetch(`${endpoint}/auth/register`, {
                method: 'POST',
                body: formData, // Enviar el FormData directamente
            });

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente.',
                }).then(() => {
                    // Guardar usuario en sessionStorage
                    sessionStorage.setItem('user', JSON.stringify(data));
                    navigate('/'); // Redirigir a la página principal
                });
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Hubo un problema al registrar tu cuenta.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al intentar registrar tu cuenta.',
            });
        }
    };

    return (
        <section className="register-bg">
            <div className="registerContainer">
                <form onSubmit={handleSubmit}>
                    <h1 id="registerTitle" className='display-1'>Registro</h1>
                    <input
                        type="text"
                        id="nombres"
                        className='form-control'
                        placeholder='Ingresa tu nombre'
                        value={nombres}
                        onChange={(e) => setNombres(e.target.value)}
                        required
                    /><br />

                    <input
                        type="text"
                        id="apellidos"
                        className='form-control'
                        placeholder='Ingresa tu apellido'
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        required
                    /><br />

                    <label htmlFor="fotoPerfil">Ingresa la foto que aparecerá en tu perfil</label>
                    <input
                        type="file"
                        id="fotoPerfil"
                        className='form-control'
                        accept="image/*"
                        onChange={handleFileChange} // Manejar el cambio de archivo
                        required
                    /><br />

                    <input
                        type="email"
                        id="email"
                        className='form-control'
                        placeholder='Ingresa tu correo electrónico'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br />

                    <input
                        type="password"
                        id="password"
                        className='form-control'
                        placeholder='Ingresa tu contraseña'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /><br />

                    <input
                        type="password"
                        id="confirmPassword"
                        className='form-control'
                        placeholder='Confirma tu contraseña'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    /><br />

                    <label htmlFor="fechaNacimiento">Ingresa tu fecha de nacimiento</label>
                    <input
                        type="date"
                        id="fechaNacimiento"
                        className='form-control'
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        required
                    /><br />

                    <button type="submit" className='btn' id='registerbtn'>Crear cuenta 😉</button><br />

                    <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
                </form>
            </div>
        </section>
    );
}

export default Register;