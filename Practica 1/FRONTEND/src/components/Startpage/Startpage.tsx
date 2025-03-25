import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Books from "./Books/Books";
import Profile from "./Profile/Profile";
import Manager from "./Manager/Manager";

interface Book {
  id: number;
  nombre: string;
  portada_url: string;
  sinopsis: string;
  autor: string;
  anio: number;
  estado: boolean;
  pdf_url: string;
  categorias: Category[];
}

interface Category {
  id: number;
  nombre: string;
}




function Startpage({ data }: { data: Book[] }) {
  let navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const user = sessionStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, []);

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
        // Mostrar confirmación con SweetAlert2
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Realmente deseas cerrar sesión?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, cerrar sesión",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            // Borrar el usuario de sessionStorage
            sessionStorage.removeItem("user");
            // Redirigir al login
            navigate("/login");
          }
        });
        break;
      default:
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