import { useState } from "react";
import { Link } from "react-router-dom";
import { IoOptions } from "react-icons/io5";

interface Book {
  id: number;
  Nombre: string;
  Portada: string;
  Sinopsis: string;
  Autor: string;
  Año: number;
  PDF: string;
  Estado: boolean;
  categoria: string[];
}

interface BooksProps {
  data: Book[];
  showAcquiredOnly: boolean;
  searchTerm?: string;
}

function Books({ data, showAcquiredOnly, searchTerm = "" }: BooksProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBooks = data
    .filter((book) => (showAcquiredOnly ? book.Estado : true)) // Filtrar por estado
    .filter((book) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        book.Nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        book.Autor.toLowerCase().includes(lowerCaseSearchTerm) ||
        book.Sinopsis.toLowerCase().includes(lowerCaseSearchTerm)
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
      {/* Filtrar por categoria */}
      <div className="dropdown mx-4">
        <br />
        <button className="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <IoOptions /> Filtrar por categoria
        </button>
        <ul className="dropdown-menu btn btn-warning">
          <button className="dropdown-item" onClick={() => setSelectedCategory(null)}>Todas</button>
          <button className="dropdown-item" onClick={() => setSelectedCategory("Ficción")}>Ficción</button>
          <button className="dropdown-item" onClick={() => setSelectedCategory("Ciencia ficción")}>Ciencia ficción</button>
          <button className="dropdown-item" onClick={() => setSelectedCategory("Fantasia")}>Fantasia</button>
          <button className="dropdown-item" onClick={() => setSelectedCategory("Historia")}>Historia</button>
          <button className="dropdown-item" onClick={() => setSelectedCategory("Autoayuda")}>Autoayuda</button>
        </ul>
      </div>
      <br />

      {/* Mostrar los libros */}
      <div className="books">
        {filteredBooks.map((book) => (
          <Link to={`/details/${book.id}`} key={book.id} className="book-card text-decoration-none">
            <img src={book.Portada} alt={book.Nombre} className="book-cover" />
            <h2 className="text-dark fs-4 text-center">{book.Nombre}</h2>
            <p className="text-dark fs-5 mx-2"><strong>Autor: </strong>{book.Autor}</p>
            <p className="book-categories">
              <strong className="text-dark mx-2">Categorías:</strong>
              <div className="mx-1">
                {book.categoria.map((cat, index) => (
                  <span key={index} className="badge bg-secondary mx-1">{cat}</span>
                ))}
              </div>
            </p>
            {searchTerm === "" && (
              <p className="book-status text-dark  mx-2">
                <strong></strong>{book.Estado ? "Adquirido ✅" : "No adquirido ❌"}
              </p>
            )}

            {searchTerm !== "" && (
              <>
                <p className="book-synopsis">{book.Sinopsis}</p>
                <button className="btn btn-primary">Adquirir libro</button>
              </>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Books;