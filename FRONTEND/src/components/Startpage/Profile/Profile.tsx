import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import img from '../../../assets/profile.png';
import { CiEdit } from "react-icons/ci";

function Profile() {
    const user = sessionStorage.getItem("user"); // Obtener el ID del usuario desde sessionStorage
    const userId = user ? JSON.parse(user).id : null;

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

    // Obtener los datos del perfil al montar el componente
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:3001/users/profile/${userId}`);
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del perfil");
                }

                const data = await response.json();
                setNombres(data.nombres);
                setApellidos(data.apellidos);
                setCorreo(data.email);
                setFechaNacimiento(data.fecha_nacimiento);
                // Si el servidor devuelve una URL de la imagen de perfil, puedes usarla aquí:
                // setFotoPerfil(data.fotoPerfil || img);
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al obtener los datos del perfil.",
                });
            }
        };

        fetchProfile();
    }, [userId]); // Dependencia: userId

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setNuevaImagen(file);
            setFotoPerfil(URL.createObjectURL(file)); // Mostrar la imagen en el componente
        }
    };

    const handleUpdateImage = async () => {
        if (!nuevaImagen || !userId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Por favor, selecciona una imagen y asegúrate de haber iniciado sesión.",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", nuevaImagen);

            const response = await fetch(`http://localhost:3001/users/profile/${userId}/image`, {
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

    const handleUpdate = async (field: string, value: string) => {
        if (!userId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo obtener el ID del usuario.",
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/users/profile/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }), // Enviar el campo y su valor
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
                                onBlur={() => {
                                    setEditNombres(false);
                                    handleUpdate("nombres", nombres);
                                }}
                                autoFocus
                            />
                        ) : (
                            <>{nombres} {apellidos} <button className="btn btn-success" onClick={() => setEditNombres(true)}><CiEdit /></button></>
                        )}
                    </h2>
                    <h3 className="py-2">
                        {editCorreo ? (
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                onBlur={() => {
                                    setEditCorreo(false);
                                    handleUpdate("email", correo);
                                }}
                                autoFocus
                            />
                        ) : (
                            <>{correo} <button className="btn btn-success" onClick={() => setEditCorreo(true)}><CiEdit /></button></>
                        )}
                    </h3>
                    <h4 className="py-2">Fecha de nacimiento: {fechaNacimiento}</h4>
                    <h4 className="py-2">Libros adquiridos <strong className="fs-2 mx-3">3</strong></h4>
                </div>
            </div>
        </section>
    );
}

export default Profile;