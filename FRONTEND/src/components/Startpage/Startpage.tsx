import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Books from "./Books/Books";
import Profile from "./Profile/Profile";
import Manager from "./Manager/Manager";

interface Book {
  id: number;
  Nombre: string;
  Portada: string;
  Sinopsis: string;
  Autor: string;
  Año: number;
  PDF: string;
  Estado: boolean;
}

function Startpage({ data }: { data: Book[] }) {
  let navigate = useNavigate();
  const [content, setContent] = useState<React.ReactNode>(
    <Books data={data} showAcquiredOnly={false} />
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleSidebarClick = (option: string) => {
    switch (option) {
      case "home":
        setContent(<Books data={data} showAcquiredOnly={false} searchTerm={searchTerm} />);
        break;
      case "profile":
        setContent(<Profile />);
        break;
      case "MyBooks":
        setContent(<Books data={data} showAcquiredOnly={true} searchTerm={searchTerm} />);
        break;
      case "manage":
        setContent(<Manager data={data} />);
        break;
      case "logout":
        navigate("/login");
        break;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term); // Actualizar el término de búsqueda
    setContent(<Books data={data} showAcquiredOnly={false} searchTerm={term} />); // Actualizar el contenido
  };

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div className="content">
        <Sidebar onSidebarClick={handleSidebarClick} />
        {content}
      </div>
    </div>
  );
}

export default Startpage;