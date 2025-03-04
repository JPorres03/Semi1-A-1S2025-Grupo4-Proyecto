import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import Swal from "sweetalert2";


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
                const response = await fetch(`https://tu-backend.com/api/books/${id}`, {
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
                <button className="add-button" onClick={() => navigate("/add")}>
                    <IoIosAddCircle className="add" />
                </button>

                {books.map((book: Book) => (
                    <div key={book.id} className="book-card">
                        {/* Mostrar siempre la portada, nombre y autor */}
                        <img src={book.Portada} alt={book.Nombre} className="book-cover" />
                        <h2 className="book-title">{book.Nombre}</h2>
                        <p className="book-author">{book.Autor}</p>
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