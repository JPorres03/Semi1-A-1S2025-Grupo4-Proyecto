import React, { useState } from "react";

interface NavbarProps {
  onSearch: (searchTerm: string) => void; // Función para manejar la búsqueda
}

function Navbar({ onSearch }: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term); // Notificar al componente padre
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-light">
        <h1 id="ebookTitle" className="mx-4 my-1">ebookVault</h1>

        <form className="search mx-4" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="📚 Busca tu libro favorito"
            aria-label="Buscar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </nav>
    </div>
  );
}

export default Navbar;