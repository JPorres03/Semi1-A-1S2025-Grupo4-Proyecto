import { useState } from "react";
import Swal from "sweetalert2";
import img from '../../../assets/profile.png';
import { CiEdit } from "react-icons/ci";

function Profile() {
  // Estados para los campos editables
  const [nombres, setNombres] = useState<string>("Nombres y apellidos");
  const [correo, setCorreo] = useState<string>("correo@example.com");
  const [fotoPerfil, setFotoPerfil] = useState<string>(img); // Estado para la imagen de perfil
  const [editFoto, setEditFoto] = useState<boolean>(false); // Estado para controlar la edición de la imagen

  // Estados para controlar la edición de cada campo
  const [editNombres, setEditNombres] = useState<boolean>(false);
  const [editCorreo, setEditCorreo] = useState<boolean>(false);
  
  // Función para manejar el cambio de la imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPerfil(reader.result as string); // Guardar la URL base64
        handleUpdateImage(reader.result as string); // Enviar la nueva imagen al backend
      };
      reader.readAsDataURL(file); // Convertir el archivo a base64
    }
  };

  // Función para manejar la actualización de la imagen en el backend
  const handleUpdateImage = async (image: string) => {
    try {
      // Realizar la petición de actualización al backend
      const response = await fetch("https://tu-backend.com/api/profile/image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la imagen de perfil");
      }

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Imagen actualizada!",
        text: "La imagen de perfil se ha actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar la imagen de perfil.",
      });
    }
  };

  // Función para manejar la actualización de los datos
  const handleUpdate = async (field: string, value: string) => {
    try {
      // Realizar la petición de actualización al backend
      const response = await fetch("https://tu-backend.com/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, value }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      // Mostrar alerta de éxito
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El perfil se ha actualizado correctamente.",
      });
    } catch (error) {
      console.error("Error:", error);
      // Mostrar alerta de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el perfil.",
      });
    }
  };

  return (
    <section className="profile-bg">
      <div className="profileContainer px-4">
        {/* Imagen de perfil */}
        <img src={fotoPerfil} alt="foto-profile" /><br />

        {/* Botón para editar la imagen */}
        <button className="btn btn-success" onClick={() => setEditFoto(!editFoto)}>Editar imagen</button>

        {/* Campo de entrada para la nueva imagen */}
        {editFoto && (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control mt-2"
          />
        )}

        <div className="d-flex flex-column justify-content-around align-items-center py-4">
          {/* Campo para nombres y apellidos */}
          <h2 className="py-2">
            {editNombres ? (
              <input
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                onBlur={() => {
                  setEditNombres(false);
                  handleUpdate("nombres", nombres);
                }}
                autoFocus
              />
            ) : (
              <>
                {nombres} <button className="btn btn-success" onClick={() => setEditNombres(true)}><CiEdit /></button>
              </>
            )}
          </h2>

          {/* Campo para correo electrónico */}
          <h3 className="py-2">
            {editCorreo ? (
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onBlur={() => {
                  setEditCorreo(false);
                  handleUpdate("correo", correo);
                }}
                autoFocus
              />
            ) : (
              <>
                {correo} <button className="btn btn-success" onClick={() => setEditCorreo(true)}><CiEdit /></button>
              </>
            )}
          </h3>

          {/* Campo para libros adquiridos */}
          <h4 className="py-2">Libros adquiridos <strong className="fs-2 mx-3">3</strong></h4>
        </div>
      </div>
    </section>
  );
}

export default Profile;