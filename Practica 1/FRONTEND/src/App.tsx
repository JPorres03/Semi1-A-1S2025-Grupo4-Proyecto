import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Startpage from "./components/Startpage/Startpage";
import Details from "./components/Startpage/Books/Details/Details";
import { useEffect, useState } from 'react';
import { TrophySpin } from "react-loading-indicators";
import UpdateBook from "./components/Startpage/Manager/UpdateBook/UpdateBook";
import AddBook from "./components/Startpage/Manager/AddBook/AddBook";
import { endpoint } from "./main";


function App() {
  const [books, setBooks] = useState<any[]>([]); // Estado para almacenar los datos de los libros
  const [loading, setLoading] = useState<boolean>(true); // Estado para manejar el loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${endpoint}/books`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const result = await response.json();
        setBooks(result);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <Route path="/details/:id" element={<Details />} />
        <Route path="/update/:id" element={<UpdateBook />} />
        <Route path="/add" element={<AddBook />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
