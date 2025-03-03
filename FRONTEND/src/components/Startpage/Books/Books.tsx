import { Link } from "react-router-dom";

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

interface BooksProps {
  data: Book[];
  showAcquiredOnly: boolean;
  searchTerm?: string; // Término de búsqueda
}

function Books({ data, showAcquiredOnly, searchTerm = "" }: BooksProps) {
  // Filtrar libros según el estado y el término de búsqueda
  const filteredBooks = data
    .filter((book) => (showAcquiredOnly ? book.Estado : true)) // Filtrar por estado
    .filter((book) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return (
        book.Nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        book.Autor.toLowerCase().includes(lowerCaseSearchTerm) ||
        book.Sinopsis.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

  return (
    <section className="books-container">
      <div className="books">
        {filteredBooks.map((book) => (
          <Link to={`/details/${book.id}`} key={book.id} className="book-card">
            {/* Mostrar siempre la portada, nombre y autor */}
            <img src={book.Portada} alt={book.Nombre} className="book-cover" />
            <h2 className="book-title">{book.Nombre}</h2>
            <p className="book-author">{book.Autor}</p>

            {/* Mostrar el estado del libro si la búsqueda está vacía */}
            {searchTerm === "" && (
              <p className="book-status">
                {book.Estado ? "Adquirido ✅" : "No adquirido ❌"}
              </p>
            )}

            {/* Mostrar sinopsis y botón de adquirir si la búsqueda no está vacía */}
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