import React from 'react';

// Definimos el tipo de las props
interface SidebarProps {
  onSidebarClick: (option: string) => void;
}

// Definimos el tipo del usuario
interface User {
  name: string;
  // Agrega otras propiedades del usuario si es necesario
}

// Componente Sidebar con TypeScript
const Sidebar: React.FC<SidebarProps> = ({ onSidebarClick }) => {
  // Obtener el usuario desde sessionStorage
  const userString = sessionStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  // Verificar si el usuario es un administrador
  const isAdmin = user?.name === 'admin';

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