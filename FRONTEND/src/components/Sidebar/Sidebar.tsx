import React from 'react';


// Definimos el tipo de las props
interface SidebarProps {
  onSidebarClick: (option: string) => void;
}


// Componente Sidebar con TypeScript
const Sidebar: React.FC<SidebarProps> = ({ onSidebarClick }) => {
  const user = sessionStorage.getItem("user"); // Obtener la cadena JSON
  const usuario = user ? JSON.parse(user) : false; // Parsear la cadena JSON a un objeto

  // Verificar si el usuario es un administrador
  const isAdmin = usuario.role === "Admin" ? true : false;

  return (
    <section className="nav">
      <ul>
        <li>
          <button className="text-center fs-6" onClick={() => onSidebarClick('home')}>
            Inicio
          </button>
        </li>
        <li>
          <button className="text-center fs-6" onClick={() => onSidebarClick('profile')}>
            Mi perfil
          </button>
        </li>
        <li>
          <button className="text-center fs-6" onClick={() => onSidebarClick('MyBooks')}>
            Mis libros
          </button>
        </li>
        {/* Mostrar la opción "Administrar" solo si el usuario es un administrador */}
        {isAdmin && (
          <li>
            <button className="text-center fs-6" onClick={() => onSidebarClick('manage')}>
              Administrar
            </button>
          </li>
        )}
        <li>
          <button className="text-center fs-6" id="session" onClick={() => onSidebarClick('logout')}>
            Cerrar sesión
          </button>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;