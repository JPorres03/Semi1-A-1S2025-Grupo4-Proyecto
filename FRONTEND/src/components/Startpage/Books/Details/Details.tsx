import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { endpoint } from "../../../../main";
import { TrophySpin } from "react-loading-indicators";

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

const user = sessionStorage.getItem("user"); // Obtener la cadena JSON
const usuario = user ? JSON.parse(user) : null; // Parsear la cadena JSON a un objeto
console.log(usuario);

function Details() {
  const [book, setBook] = useState<Book | null>(null);
  const [myBooks, setMyBooks] = useState<{ books: Book[] }>({ books: [] });

  let navigate = useNavigate();
  let params = useParams();
  const book_id = Number(params.id);

  // Obtener los datos del libro
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${endpoint}/books/${book_id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del libro");
        }

        const data = await response.json();
        setBook(data); // Actualizar el estado con los datos del libro
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al obtener los datos del libro.",
        }).then(() => {
          navigate("/"); // Redirigir al inicio
        });
      }
    };
    fetchBook();
  }, [book_id, navigate]);

  // Obtener los libros del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      if (!usuario || !usuario.user_id) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el ID del usuario. Por favor, inicia sesión nuevamente.",
        });
        return;
      }

      try {
        const response = await fetch(`${endpoint}/users/books/${usuario.user_id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setMyBooks(data); // Actualizar el estado con los libros del usuario
      } catch (error) {
        console.error("Error al obtener los libros del usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al obtener tus libros. Por favor, intenta nuevamente más tarde.",
        });
      }
    };

    fetchProfile();
  }, [usuario?.user_id]);

  // Marcar el libro como adquirido si está en la lista del usuario
  if (book && myBooks.books.some((libro: Book) => libro.id === book.id)) {
    book.estado = true;
  }

  // Mostrar un loader mientras se carga el libro
  if (!book) {
    return (
      <div className="loader bg-dark">
        <h1 id="ebookTitle" className="display-1 text-center text-light">ebookVault</h1>
        <TrophySpin color="#cc3131" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="container-fluid details">
      <div className="row details-content px-5 py-5">
        <div className="col-md-4">
          {/* Imagen de la portada */}
          <img
            src={book.portada_url}
            alt={book.nombre}
            className="img-fluid"
          />
        </div>
        <div className="col-md-8">
          {/* Nombre del libro */}
          <h1>{book.nombre}</h1>
          {/* Nombre del autor */}
          <p className="text-muted">Autor: {book.autor}</p>
          {/* Sinopsis del libro */}
          <p className="lead">{book.sinopsis}</p>
          {/* Año de publicación */}
          <p className="text-muted">Año: {book.anio}</p>
          {/* Opción para adquirir o leer el libro */}
          <div className="mt-4">
            {book.estado ? (
              <button className="btn btn-primary me-2" onClick={() => { window.open(`${book.pdf_url}`, "_blank") }}>
                Leer libro
              </button>
            ) : (
              <button
                className="btn btn-success me-2"
                onClick={async () => {
                  // Mostrar un cuadro de diálogo de confirmación
                  const result = await Swal.fire({
                    icon: "info",
                    title: "Adquirir libro",
                    text: "¿Deseas adquirir este libro?",
                    showCancelButton: true,
                    confirmButtonText: "Sí, adquirir",
                    cancelButtonText: "Cancelar",
                  });

                  // Si el usuario confirma la adquisición
                  if (result.isConfirmed) {
                    try {
                      // Crear el cuerpo de la solicitud en formato JSON
                      const body = JSON.stringify({
                        usuario_id: usuario.user_id,
                      });

                      // Realizar la solicitud POST al endpoint
                      const response = await fetch(`${endpoint}/books/${book_id}/acquire`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json", // Especificar el tipo de contenido como JSON
                        },
                        body: body, // Enviar el cuerpo en formato JSON
                      });

                      // Verificar si la solicitud fue exitosa
                      if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                      }

                      // Mostrar un mensaje de éxito
                      Swal.fire({
                        icon: "success",
                        title: "Libro adquirido",
                        text: "El libro ha sido añadido a tu colección.",
                      }).then(() => {
                        // Recargar la página o actualizar el estado para reflejar el cambio
                        window.location.reload();
                      });
                    } catch (error) {
                      console.error("Error al adquirir el libro:", error);

                      // Mostrar un mensaje de error
                      Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un problema al adquirir el libro. Por favor, intenta nuevamente más tarde.",
                      });
                    }
                  }
                }}
              >
                Adquirir libro
              </button>
            )}
            <button className="btn btn-warning me-2" onClick={() => { navigate(-1) }}>Regresar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;