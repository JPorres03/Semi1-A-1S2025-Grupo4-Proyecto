import { Link } from "react-router-dom";
import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";

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
}

function Manager({ data }: BooksProps) {

    const [books] = useState<Book[]>(data);

    return (
        <section className="books-container">
            <div className="books">
                <button className="add-button">
                    <IoIosAddCircle className="add" />
                </button>

                {books.map((book: Book) => (
                    <Link to={`/details/${book.id}`} key={book.id} className="book-card">
                        {/* Mostrar siempre la portada, nombre y autor */}
                        <img src={book.Portada} alt={book.Nombre} className="book-cover" />
                        <h2 className="book-title">{book.Nombre}</h2>
                        <p className="book-author">{book.Autor}</p>
                        <div className="manager-buttons">
                            <button type="button" className="btn btn-success">Detalles</button>
                            <button type="button" className="btn btn-secondary">Actualizar</button>
                            <button type="button" className="btn btn-danger">Eliminar</button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default Manager;