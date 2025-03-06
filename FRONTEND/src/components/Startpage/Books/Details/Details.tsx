import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

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

// Definimos las props del componente Books
interface BooksProps {
  data: Book[];
}


function Details({ data }: BooksProps) {
  let navigate = useNavigate();
  let params = useParams();
  // Inicializamos el estado con los datos recibidos
  const [books] = useState<Book[]>(data);
  // Buscar el libro correspondiente en la lista de libros
  const book = books.find((book) => book.id === Number(params.id));

  // Si no se encuentra el libro, mostrar un mensaje
  if (!book) {
    return <div>
      <div className="fs-1 text-dark">Libro no encontrado</div>;
      <button className="btn btn-warning me-2" onClick={() => { navigate(-1) }} >Regresar</button>
    </div>
  }
  return (
    <div className="container-fluid details">
      <div className="row details-content px-5 py-5">
        <div className="col-md-4">
          {/* Imagen de la portada */}
          <img
            src={book.Portada}
            alt={book.Nombre}
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          {/* Nombre del libro */}
          <h1>{book.Nombre}</h1>
          {/* Nombre del autor */}
          <p className="text-muted">Autor: {book.Autor}</p>
          {/* Sinopsis del libro */}
          <p className="lead">{book.Sinopsis}</p>
          {/* Año de publicación */}
          <p className="text-muted">Año: {book.Año}</p>
          {/* Opción para adquirir o leer el libro */}
          <div className="mt-4">
            {book.Estado ? <button className="btn btn-primary me-2">Leer libro</button> : <button className="btn btn-success me-2">Adquirir libro</button>}
            <button className="btn btn-warning me-2" onClick={() => { navigate(-1) }} >Regresar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;