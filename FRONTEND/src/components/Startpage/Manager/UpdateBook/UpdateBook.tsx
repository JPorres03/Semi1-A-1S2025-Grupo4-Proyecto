import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { endpoint } from "../../../../main";

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


function UpdateBook() {
  const navigate = useNavigate();
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const user = sessionStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, []);

  // Buscar el libro correspondiente en la lista de libros
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

        // Actualizar los estados con los datos recibidos
        setBook(data);
        setNombre(data.nombre);
        setAutor(data.autor);
        setSinopsis(data.sinopsis);
        setAño(data.anio);
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
  }, [book_id]);

  // Estados para los campos editables
  const [nombre, setNombre] = useState<string>("");
  const [sinopsis, setSinopsis] = useState<string>("");
  const [autor, setAutor] = useState<string>("");
  const [año, setAño] = useState<number>(0);
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const [nuevoPDF, setNuevoPDF] = useState<File | null>(null);

  // Si no se encuentra el libro, mostrar un mensaje
  if (!book) {
    return <div>Libro no encontrado</div>;
  }

  // Función para manejar la actualización de la imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNuevaImagen(file);
    }
  };

  // Función para manejar la actualización del PDF
  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNuevoPDF(file);
    }
  };

  // Función para actualizar los campos básicos (nombre, autor, sinopsis, año)
  const handleUpdateBook = async () => {
    try {
      const updatedFields: any = {};

      // Verificar si los campos han cambiado
      if (nombre !== book.nombre) updatedFields.nombre = nombre;
      if (autor !== book.autor) updatedFields.autor = autor;
      if (sinopsis !== book.sinopsis) updatedFields.sinopsis = sinopsis;
      if (año !== book.anio) updatedFields.anio_publicacion = año;

      // Si no hay campos actualizados, no hacer la petición
      if (Object.keys(updatedFields).length === 0) {
        console.log("No hay campos para actualizar.");
        return;
      }

      const response = await fetch(`${endpoint}/admin/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el libro");
      }

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Los datos del libro se han actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar los datos del libro.",
      });
    }
  };

  // Función para actualizar la portada
  const handleUpdatePortada = async () => {
    if (!nuevaImagen) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, selecciona una nueva imagen.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nueva_foto", nuevaImagen);

      const response = await fetch(`${endpoint}/admin/books/update_portada/${book.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la portada");
      }

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "La portada se ha actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la portada.",
      });
    }
  };

  // Función para actualizar el PDF
  const handleUpdatePDF = async () => {
    if (!nuevoPDF) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, selecciona un nuevo PDF.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nuevo_pdf", nuevoPDF);

      const response = await fetch(`${endpoint}/admin/books/update_pdf/${book.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el PDF");
      }

      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El PDF se ha actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el PDF.",
      });
    }
  };

  // Función para manejar la actualización completa
  const handleUpdate = async () => {
    await handleUpdateBook(); // Actualizar datos básicos si hay cambios
    if (nuevaImagen) await handleUpdatePortada(); // Actualizar portada si hay una nueva
    if (nuevoPDF) await handleUpdatePDF(); // Actualizar PDF si hay uno nuevo

    navigate("/"); // Redirigir a la página principal
  };

  return (
    <div className="container-fluid details">
      <div className="display-1 text-light my-4">ACTUALIZAR</div>
      <div className="row details-content px-5 py-5">
        <h2>{book.nombre}</h2>
        <div className="col-md-4">
          {/* Imagen de la portada */}
          <img src={book.portada_url} alt={nombre} className="img-fluid" />
          {/* Campo para actualizar la imagen */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control mt-3"
          />
        </div>
        <div className="col-md-8">
          {/* Nombre del libro */}
          <h1>{book.nombre}</h1>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control mb-3"
            placeholder="Nuevo nombre"
          />

          {/* Nombre del autor */}
          <p className="text-muted">Autor: {book.autor}</p>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="form-control mb-3"
            placeholder="Nuevo autor"
          />

          {/* Sinopsis del libro */}
          <p className="lead">{book.sinopsis}</p>
          <textarea
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            className="form-control mb-3"
            placeholder="Nueva sinopsis"
          />

          {/* Año de publicación */}
          <p className="text-muted">Año: {book.anio}</p>
          <input
            type="number"
            value={año}
            onChange={(e) => setAño(Number(e.target.value))}
            className="form-control mb-3"
            placeholder="Nuevo año"
          />

          {/* Campo para actualizar el PDF */}
          <div className="mb-3">
            <label htmlFor="pdfFile" className="form-label">
              Seleccionar nuevo PDF
            </label>
            <input
              type="file"
              id="pdfFile"
              accept="application/pdf"
              onChange={handlePDFChange}
              className="form-control"
            />
          </div>

          {/* Botones de acción */}
          <div className="mt-4">
            <button className="btn btn-primary me-2" onClick={handleUpdate}>
              Actualizar libro
            </button>
            <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>
              Regresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBook;