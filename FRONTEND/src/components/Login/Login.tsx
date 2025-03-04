import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import img from '../../assets/login.jpg';


function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas
        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Has iniciado sesión correctamente.',
                }).then(() => {
                    sessionStorage.setItem('user', JSON.stringify(data));
                    navigate('/'); // Redirigir a la página principal
                });
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Credenciales incorrectas.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al intentar iniciar sesión.',
            });
        }
    };

    return (
        <section className="login-bg">
            <div className="loginContainer">
                <img src={img} alt="foto-login" />
                <form onSubmit={handleSubmit}>
                    <h1 id="loginTitle" className='display-1'>Login</h1>
                    <input
                        type="email"
                        className='form-control'
                        placeholder='Ingresa tu correo electrónico'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /><br />
                    <input
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        className='form-control'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /><br />
                    <button type="submit" className='btn' id='loginbtn'>Ingresar</button><br />
                    <p>¿No tienes cuenta? <a href="/register">regístrate😃</a></p>
                </form>
            </div>
        </section>
    );
}

export default Login;