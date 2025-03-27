import logo from '../../../assets/main-logo-white-transparent.svg';
import { useState } from "react";

function Navbar() {
    // Estado que guarda el botón activo (null inicialmente)
    const [activeButton, setActiveButton] = useState<string | null>(null);

    return (
        <div className="navbarContainer">
            <button 
                className={`btn fs-2 ${activeButton === 'archivos' ? 'neon-active' : ''}`}
                onClick={() => setActiveButton('archivos')}
            >
                Files
            </button>
            
            <img src={logo} alt="logo" />
            
            <button 
                className={`btn fs-2 ${activeButton === 'tareas' ? 'neon-active' : ''}`}
                onClick={() => setActiveButton('tareas')}
            >
                Tasks
            </button>
        </div>
    );
}

export default Navbar;