import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoOptions } from "react-icons/io5";
import { endpoint } from "../../../main";
import Swal from "sweetalert2";

const user = sessionStorage.getItem("user"); // Obtener la cadena JSON
const usuario = user ? JSON.parse(user) : null; // Parsear la cadena JSON a un objeto

interface Book {
  id: number;
  nombre: string;
  portada_url: string;
  sinopsis: string;
  autor: string;
  anio: number;
  estado: boolean;
  pdf_url: string;
  categoria: string[];
}

interface Category {
  id: number;
  nombre: string;
}

interface BooksProps {
  data: Book[];
  showAcquiredOnly: boolean;
  searchTerm?: string;
}

function Books({ data, showAcquiredOnly, searchTerm = "" }: BooksProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]); // Estado para los libros adquiridos

  // Obtener las categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${endpoint}/categories`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategories(data); // Asume que la respuesta es un array de categorías
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al obtener las categorías.",
        });
      }
    };

    fetchCategories();
  }, []);

  // Obtener los libros adquiridos por el usuario
  useEffect(() => {
    const fetchMyBooks = async () => {
      if (!usuario || !usuario.user_id) {
        return;
      }

      try {
        const response = await fetch(`${endpoint}/users/books/${usuario.user_id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los libros adquiridos");
        }

        const data = await response.json();
        setMyBooks(data.books || []); // Si no hay libros, establecer un array vacío
      } catch (error) {
      }
    };

    fetchMyBooks();
  }, [usuario?.user_id]);

  // Filtrar los libros
  const filteredBooks = data
    .filter((book) => (showAcquiredOnly ? myBooks.some((libro) => libro.id === book.id) : true)) // Filtrar por estado
    .filter((book) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        book.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        book.autor.toLowerCase().includes(lowerCaseSearchTerm)
      );
    })
    .filter((book) => {
      if (selectedCategory) {
        return book.categoria.includes(selectedCategory);
      }
      return true;
    });

  return (
    <section className="books-container">
      {/* Filtrar por categoría */}
      <div className="dropdown mx-4">
        <br />
        <button className="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <IoOptions /> Filtrar por categoría
        </button>
        <ul className="dropdown-menu btn btn-warning">
          <button className="dropdown-item" onClick={() => setSelectedCategory(null)}>Todas</button>
          {categories.map((category) => (
            <button key={category.id} className="dropdown-item" onClick={() => setSelectedCategory(category.nombre)}>
              {category.nombre}
            </button>
          ))}
        </ul>
      </div>
      <br />

      {/* Mostrar los libros */}
      <div className="books">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link to={`/details/${book.id}`} key={book.id} className="book-card text-decoration-none">
              <img src={book.portada_url} alt={book.nombre} className="book-cover" />
              <h2 className="text-dark fs-4 text-center">{book.nombre}</h2>
              <p className="text-dark fs-5 mx-2"><strong>Autor: </strong>{book.autor}</p>
              {searchTerm === "" && (
                <p className="book-status text-dark mx-2">
                  <strong></strong>
                  {myBooks.some((libro) => libro.id === book.id) ? "Adquirido ✅" : "No adquirido ❌"}
                </p>
              )}
              {searchTerm !== "" && (
                <>
                  <p className="book-synopsis">{book.sinopsis}</p>
                  <button className="btn btn-primary">Adquirir libro</button>
                </>
              )}
            </Link>
          ))
        ) : (
          <p>No se encontraron libros.</p> // Mensaje si no hay libros
        )}
      </div>
    </section>
  );
}

export default Books;