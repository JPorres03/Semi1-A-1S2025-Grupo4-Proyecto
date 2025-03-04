function Register() {
    return (
        <section className="register-bg">
            <div className="registerContainer">
                <form>
                    <h1 id="registerTitle" className='display-1'>Registro</h1>
                    <input
                        type="text"
                        id="nombres"
                        className='form-control'
                        placeholder='Ingresa tu nombre'
                        required
                    /><br />

                    <input
                        type="text"
                        id="apellidos"
                        className='form-control'
                        placeholder='Ingresa tu apellido'
                        required
                    /><br />

                    <label htmlFor="fotoPerfil">Ingresa la foto que aparecera en tu perfil</label>
                    <input
                        type="file"
                        id="fotoPerfil"
                        className='form-control'
                        accept="image/*"
                    /><br />

                    <input
                        type="email"
                        id="email"
                        className='form-control'
                        placeholder='Ingresa tu correo electrónico'
                        required
                    /><br />

                    <input
                        type="password"
                        id="password"
                        className='form-control'
                        placeholder='Ingresa tu contraseña'
                        required
                    /><br />

                    <input
                        type="password"
                        id="confirmPassword"
                        className='form-control'
                        placeholder='Confirma tu contraseña'
                        required
                    /><br />

                    <label htmlFor="fechaNacimiento">Ingresa tu fecha de nacimiento</label>
                    <input
                        type="date"
                        id="fechaNacimiento"
                        className='form-control'
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