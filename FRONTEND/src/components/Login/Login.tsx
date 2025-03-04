import img from '../../assets/login.jpg'

function Login() {
    return (
        <section className="login-bg">
            <div className="loginContainer">
                <img src={img} alt="foto-login" />
                <form>
                    <h1 id="loginTitle" className='display-1' >Login</h1>
                    <input type="email" className='form-control' placeholder='Ingresa tu correo electronico' /><br />
                    <input type="password" placeholder="Ingresa tu contraseña" className='form-control' /><br />
                    <button type="submit" className='btn' id='loginbtn'>Ingresar</button><br />
                    <p>¿No tienes cuenta? <a href="/register">registrate😃</a></p>
                </form>
            </div>
        </section>
    );
}

export default Login;