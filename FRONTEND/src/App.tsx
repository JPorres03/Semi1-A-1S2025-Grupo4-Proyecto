import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Startpage from "./components/Startpage/Startpage";
import Details from "./components/Startpage/Books/Details/Details";
import data from '../MOCK_DATA.json';
import { useEffect, useState } from 'react';
import { TrophySpin } from "react-loading-indicators";
import UpdateBook from "./components/Startpage/Manager/UpdateBook/UpdateBook";
import AddBook from "./components/Startpage/Manager/AddBook/AddBook";


function App() {
  const [books, setBooks] = useState<any[]>([]); // Estado para almacenar los datos de los libros
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar el loading

  useEffect(() => {
    // Función para obtener los datos del backend
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:3001/api/books'); // Cambia la URL por la de tu backend
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const result = await response.json();
        setBooks(result); // Guardar los datos del backend
      } catch (error) {
        console.error('Error fetching data:', error);
        setBooks(data); // Usar MOCK_DATA si la petición falla
      } finally {
        setLoading(false); // Desactivar el estado de loading
      }
    };

    fetchData(); // Llamar a la función para obtener los datos
  }, []);

  if (loading) {
    return <div className="loader bg-dark">
      <h1 id="ebookTitle" className="display-1 text-center text-light">ebookVault</h1>
      <TrophySpin color="#cc3131" size="medium" text="" textColor="" />;
    </div> // Mostrar un mensaje de carga mientras se obtienen los datos
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Startpage data={books} />} />
        <Route path="/details/:id" element={<Details data={books} />} />
        <Route path="/update/:id" element={<UpdateBook data={books}/>} />
        <Route path="/add" element={<AddBook/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;