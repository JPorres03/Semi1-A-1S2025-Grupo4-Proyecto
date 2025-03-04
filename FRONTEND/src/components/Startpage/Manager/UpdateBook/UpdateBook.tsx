import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
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

// Definimos las props del componente Books
interface BooksProps {
  data: Book[];
}

function UpdateBook({ data }: BooksProps) {
  const navigate = useNavigate();
  const params = useParams();

  // Buscar el libro correspondiente en la lista de libros
  const book = data.find((book) => book.id === Number(params.id));

  // Estados para los campos editables
  const [nombre, setNombre] = useState<string>(book?.Nombre || "");
  const [portada, setPortada] = useState<string>(book?.Portada || "");
  const [sinopsis, setSinopsis] = useState<string>(book?.Sinopsis || "");
  const [autor, setAutor] = useState<string>(book?.Autor || "");
  const [año, setAño] = useState<number>(book?.Año || 0);
  const [nuevaImagen, setNuevaImagen] = useState<string | null>(null); // Para la nueva imagen en base64
  const [nuevoPDF, setNuevoPDF] = useState<File | null>(null); // Para el nuevo PDF

  // Si no se encuentra el libro, mostrar un mensaje
  if (!book) {
    return <div>Libro no encontrado</div>;
  }

  // Función para manejar la actualización de la imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevaImagen(reader.result as string); // Guardar la URL base64
        setPortada(reader.result as string); // Actualizar la vista previa de la imagen
      };
      reader.readAsDataURL(file); // Convertir el archivo a base64
    }
  };

  // Función para manejar la actualización del PDF
  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNuevoPDF(file);
    }
  };

  // Función para manejar la actualización del libro
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("Nombre", nombre);
      formData.append("Sinopsis", sinopsis);
      formData.append("Autor", autor);
      formData.append("Año", año.toString());
      
      // Agregar la nueva imagen si está presente
      if (nuevaImagen) {
        formData.append("Portada", nuevaImagen);
      }

      // Agregar el nuevo PDF si está presente
      if (nuevoPDF) {
        formData.append("PDF", nuevoPDF);
      }

      // Realizar la petición de actualización
      const response = await fetch(`https://tu-backend.com/api/books/${book.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el libro");
      }

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El libro se ha actualizado correctamente.",
      }).then(() => {
        navigate("/"); // Redirigir a la página principal
      });
    } catch (error) {
      console.error("Error:", error);
      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el libro.",
      });
    }
  };

  return (
    <div className="container-fluid details">
        <div className="display-1 text-light my-4">ACTUALIZAR</div>
      <div className="row details-content px-5 py-5">
        <div className="col-md-4">
          {/* Imagen de la portada */}
          <img
            src={portada}
            alt={nombre}
            className="img-fluid"
          />
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
          <h1>{book.Nombre}</h1>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="form-control mb-3"
            placeholder="Nuevo nombre"
          />

          {/* Nombre del autor */}
          <p className="text-muted">Autor: {book.Autor}</p>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="form-control mb-3"
            placeholder="Nuevo autor"
          />

          {/* Sinopsis del libro */}
          <p className="lead">{book.Sinopsis}</p>
          <textarea
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            className="form-control mb-3"
            placeholder="Nueva sinopsis"
          />

          {/* Año de publicación */}
          <p className="text-muted">Año: {book.Año}</p>
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