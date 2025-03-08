import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import img from '../../../assets/profile.png';
import { CiEdit } from "react-icons/ci";
import { endpoint } from "../../../main";

function Profile() {
    const user = sessionStorage.getItem("user"); // Obtener la cadena JSON
    const usuario = user ? JSON.parse(user) : null; // Parsear la cadena JSON a un objeto

    // Estados para los datos del perfil
    const [nombres, setNombres] = useState<string>("Name");
    const [apellidos, setApellidos] = useState<string>("Lastname");
    const [correo, setCorreo] = useState<string>("example@example.com");
    const [fechaNacimiento, setFechaNacimiento] = useState<string>("unknown");
    const [fotoPerfil, setFotoPerfil] = useState<string>(img);
    const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
    const [editFoto, setEditFoto] = useState<boolean>(false);
    const [editNombres, setEditNombres] = useState<boolean>(false);
    const [editCorreo, setEditCorreo] = useState<boolean>(false);
    const [books, setBooks] = useState(0);

    // Obtener los datos del perfil al montar el componente
    useEffect(() => {
        const fetchProfile = async () => {
            if (!usuario || !usuario.user_id) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo obtener el ID del usuario.",
                });
                return;
            }

            try {
                const response = await fetch(`${endpoint}/users/profile/${usuario.user_id}`);
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del perfil");
                }

                const data = await response.json();
                
                // Actualizar los estados con los datos recibidos
                setNombres(data.nombres || "Name");
                setApellidos(data.apellidos || "Lastname");
                setCorreo(data.email || "example@example.com");
                setFechaNacimiento(data.fecha_nacimiento || "unknown");
                setFotoPerfil(data.foto_perfil_url || img); // Usar la imagen del servidor o la predeterminada
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al obtener los datos del perfil.",
                });
            }

            try {
                const response = await fetch(`${endpoint}/users/books/${usuario.user_id}`);
                const data = await response.json();

                // Actualizar los estados con los datos recibidos
                setBooks(data.total_books || 0);
            } catch (error) {}
        };

        fetchProfile();
    }, [usuario?.user_id]); // Dependencia: usuario.user_id

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setNuevaImagen(file);
            setFotoPerfil(URL.createObjectURL(file)); // Mostrar la imagen en el componente
        }
    };

    // Función para actualizar la foto de perfil
    const handleUpdateImage = async () => {
        if (!nuevaImagen || !usuario || !usuario.user_id) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, selecciona una imagen y asegúrate de haber iniciado sesión.",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nueva_foto", nuevaImagen);

            const response = await fetch(`${endpoint}/users/profile/update_foto/${usuario.user_id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al actualizar la imagen de perfil");
            }

            const data = await response.json();
            setFotoPerfil(data.fotoPerfil); // Actualizar la URL de la imagen de perfil

            Swal.fire({
                icon: "success",
                title: "¡Imagen actualizada!",
                text: "La imagen de perfil se ha actualizado correctamente.",
            });
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al actualizar la imagen de perfil.",
            });
        }
    };

    // Función para actualizar los datos del perfil
    const handleUpdateProfile = async () => {
        if (!usuario || !usuario.user_id) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo obtener el ID del usuario.",
            });
            return;
        }

        const updatedFields: any = {};

        // Verificar si los campos han cambiado
        if (nombres !== usuario.nombres) updatedFields.nombres = nombres;
        if (apellidos !== usuario.apellidos) updatedFields.apellidos = apellidos;
        if (correo !== usuario.email) updatedFields.email = correo;
        if (fechaNacimiento !== usuario.fecha_nacimiento) updatedFields.fecha_nacimiento = fechaNacimiento;

        // Si no hay campos actualizados, no hacer la petición
        if (Object.keys(updatedFields).length === 0) {
            console.log("No hay campos para actualizar.");
            return;
        }

        try {
            const response = await fetch(`${endpoint}/users/profile/${usuario.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFields),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el perfil");
            }

            Swal.fire({
                icon: "success",
                title: "¡Actualizado!",
                text: "El perfil se ha actualizado correctamente.",
            });
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al actualizar el perfil.",
            });
        }
    };

    // Función para manejar la actualización de los nombres
    const handleUpdateNombres = () => {
        handleUpdateProfile(); // Actualizar el perfil
        setEditNombres(false); // Desactivar el modo de edición
    };

    // Función para manejar la actualización del correo
    const handleUpdateCorreo = () => {
        handleUpdateProfile(); // Actualizar el perfil
        setEditCorreo(false); // Desactivar el modo de edición
    };

    return (
        <section className="profile-bg">
            <div className="profileContainer px-4">
                <img src={fotoPerfil} alt="foto-profile" /><br />
                <button className="btn btn-success" onClick={() => setEditFoto(!editFoto)}>
                    Editar imagen
                </button>
                {editFoto && (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control mt-2"
                        />
                        <button className="btn btn-primary mt-2" onClick={handleUpdateImage}>
                            Guardar imagen
                        </button>
                    </div>
                )}
                <div className="d-flex flex-column justify-content-around align-items-center py-4">
                    <h2 className="py-2">
                        {editNombres ? (
                            <input
                                type="text"
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                onBlur={handleUpdateNombres}
                                autoFocus
                            />
                        ) : (
                            <>{nombres} <button className="btn btn-success" onClick={() => setEditNombres(true)}><CiEdit /></button></>
                        )}
                    </h2>
                    <h3 className="py-2">
                        {editCorreo ? (
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                onBlur={handleUpdateCorreo}
                                autoFocus
                            />
                        ) : (
                            <>{correo} <button className="btn btn-success" onClick={() => setEditCorreo(true)}><CiEdit /></button></>
                        )}
                    </h3>
                    <h4 className="py-2">Fecha de nacimiento: {fechaNacimiento}</h4>
                    <h4 className="py-2">Libros adquiridos <strong className="fs-2 mx-3">{books}</strong></h4>
                </div>
            </div>
        </section>
    );
}

export default Profile;