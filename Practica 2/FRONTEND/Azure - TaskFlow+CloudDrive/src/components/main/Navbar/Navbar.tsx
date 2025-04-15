import logo from '../../../assets/main-logo-white-transparent.svg';
import { useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    onNavbarClick: (option: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavbarClick }) => {
    // Estado que guarda el botón activo (null inicialmente)
    const [activeButton, setActiveButton] = useState('tareas');
    const navigate = useNavigate();

    return (
        <div className="navbarContainer">
            <button className='btn fs-2 neon-active' id='logout' onClick={() => {
                sessionStorage.removeItem('userId');
                navigate('/login');
            }}>
            <BiLogOutCircle />
            </button>
            <div className='menu'>
                <button
                    className={`btn fs-2 ${activeButton === 'archivos' ? 'neon-active' : ''}`}
                    onClick={() => (setActiveButton('archivos'), onNavbarClick('archivos'))}
                >
                    Files
                </button>
                <img src={logo} alt="logo" />

                <button
                    className={`btn fs-2 ${activeButton === 'tareas' ? 'neon-active' : ''}`}
                    onClick={() => (setActiveButton('tareas'), onNavbarClick('tareas'))}
                >
                    Tasks
                </button>
            </div>


        </div>
    );
}

export default Navbar;