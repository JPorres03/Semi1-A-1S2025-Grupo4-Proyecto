import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoOptions } from "react-icons/io5";
import { endpoint } from "../../../main";
import Swal from "sweetalert2";

const user = sessionStorage.getItem("user");
const usuario = user ? JSON.parse(user) : null;

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

interface BooksProps {
  data: Book[];
  showAcquiredOnly: boolean;
  searchTerm?: string;
}

function Books({ data, showAcquiredOnly, searchTerm = "" }: BooksProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);

  // Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${endpoint}/categories`);
        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }
        const data = await response.json();
        setCategories(data);
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

  // Obtener libros adquiridos
  useEffect(() => {
    const fetchMyBooks = async () => {
      if (!usuario || !usuario.user_id) return;

      try {
        const response = await fetch(`${endpoint}/users/books/${usuario.user_id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los libros adquiridos");
        }

        const data = await response.json();
        setMyBooks(data.books || []);
      } catch (error) {
        console.error("Error fetching user books:", error);
      }
    };

    fetchMyBooks();
  }, [usuario?.user_id]);

  // Filtrar libros
  const filteredBooks = data
    .filter((book) => (showAcquiredOnly ? myBooks.some((libro) => libro.id === book.id) : true))
    .filter((book) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return book.nombre.toLowerCase().includes(lowerCaseSearchTerm) || book.autor.toLowerCase().includes(lowerCaseSearchTerm);
    })
    .filter((book) => {
      if (selectedCategory) {
        return book.categorias.some((cat) => cat.nombre === selectedCategory);
      }
      return true;
    });

  return (
    <section className="books-container">
      {/* Filtro por categoría */}
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
      {searchTerm === "" && (
        <div className="books">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link to={`/details/${book.id}`} key={book.id} className="book-card text-decoration-none">
                <img src={book.portada_url} alt={book.nombre} className="book-cover" />
                <p className="text-light px-2 py-2 bg-dark">
                  {myBooks.some((libro) => libro.id === book.id) ? "Adquirido ✅" : "No adquirido ❌"}
                </p>
                <h2 className="text-dark fs-4 text-center">{book.nombre}</h2>
                <p className="text-dark fs-5 mx-2"><strong>Autor: </strong>{book.autor}</p>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {book.categorias.map((cat) => (
                    <button
                      className="btn btn-secondary btn-sm"
                      key={cat.id}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-light fs-1">No se encontraron libros.</p>
          )}
        </div>
      )}
      {searchTerm !== "" && (
        <div className="searchTerm">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link to={`/details/${book.id}`} key={book.id} className="book-card2 text-decoration-none">
                <img src={book.portada_url} alt={book.nombre} className="book-cover2" />
                <div>
                  <h2 className="text-dark fs-4 text-center">{book.nombre}</h2>
                  <p className="text-dark fs-5 mx-2"><strong>Autor: </strong>{book.autor}</p>

                  {/* Mostrar categorías */}
                  <p className="text-dark mx-2"><strong>Categorías:</strong></p>
                  <div className="d-flex flex-wrap gap-2">
                    {book.categorias.map((cat) => (
                      <button
                        className="btn btn-secondary btn-sm"
                        key={cat.id}
                      >
                        {cat.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-dark mx-2">
                  <strong>Sinopsis</strong><br />{book.sinopsis}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-light fs-1">No se encontraron libros.</p>
          )}
        </div>

      )}

    </section>
  );
}

export default Books;
