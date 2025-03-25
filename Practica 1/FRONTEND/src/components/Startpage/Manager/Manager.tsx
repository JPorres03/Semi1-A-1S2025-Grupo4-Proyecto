import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import Swal from "sweetalert2";
import { endpoint } from "../../../main";

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
}

function Manager({ data }: BooksProps) {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>(data); // Estado para la lista de libros

    // Función para eliminar un libro
    const handleDelete = async (id: number) => {
        // Mostrar confirmación con SweetAlert2
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        // Si el usuario confirma la eliminación
        if (result.isConfirmed) {
            try {
                // Realizar la petición de eliminación al backend
                const response = await fetch(`${endpoint}/admin/books/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error("Error al eliminar el libro");
                }

                // Actualizar la lista de libros eliminando el libro correspondiente
                setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));

                // Mostrar alerta de éxito
                Swal.fire({
                    icon: "success",
                    title: "¡Eliminado!",
                    text: "El libro ha sido eliminado correctamente.",
                });
            } catch (error) {
                console.error("Error:", error);
                // Mostrar alerta de error
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al eliminar el libro.",
                });
            }
        }
    };

    return (
        <section className="books-container">
            <div className="books">
                <button className="btn btn-light add-button" onClick={() => navigate("/add")}>
                    <IoIosAddCircle className="add" />
                </button>

                {books.map((book: Book) => (
                    <div key={book.id} className="book-card">
                        {/* Mostrar siempre la portada, nombre y autor */}
                        <img src={book.portada_url} alt={book.nombre} className="book-cover" />
                        <h2 className="book-title">{book.nombre}</h2>
                        <p className="book-author">{book.autor}</p>
                        <div className="manager-buttons">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => navigate(`/details/${book.id}`)}
                            >
                                Detalles
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(`/update/${book.id}`)}
                            >
                                Actualizar
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDelete(book.id)} // Llamar a la función de eliminación
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Manager;