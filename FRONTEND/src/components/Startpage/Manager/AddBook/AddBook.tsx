import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import img from "../../../../assets/add.jpg";
import { endpoint } from "../../../../main";

function AddBook() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState<string>("");
    const [portada, setPortada] = useState<File | null>(null);
    const [sinopsis, setSinopsis] = useState<string>("");
    const [autor, setAutor] = useState<string>("");
    const [año, setAño] = useState<string>("");
    const [pdf, setPDF] = useState<File | null>(null);
    const [categorias, setCategorias] = useState<{ id: number; nombre: string }[]>([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]); // Estado temporal para las IDs seleccionadas

    // Obtener las categorías al montar el componente
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch(`${endpoint}/categories`);
                if (!response.ok) {
                    throw new Error("Error al obtener las categorías");
                }
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al obtener las categorías.",
                });
            }
        };

        fetchCategorias();
    }, []);

    // Manejar la selección de categorías
    const handleCategoriaClick = (id: number) => {
        setCategoriasSeleccionadas((prev) => {
            if (prev.includes(id)) {
                return prev.filter((catId) => catId !== id); // Deseleccionar
            } else {
                return [...prev, id]; // Seleccionar
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setPortada(file);
        }
    };

    const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setPDF(file);
        }
    };

    const validateYear = (year: string): boolean => {
        const yearNumber = parseInt(year, 10);
        return !isNaN(yearNumber) && yearNumber > 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verificar campos obligatorios
        if (!nombre || !portada || !sinopsis || !autor || !año || !pdf || categoriasSeleccionadas.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor, completa todos los campos y selecciona al menos una categoría.",
            });
            return;
        }

        // Validar año
        if (!validateYear(año)) {
            Swal.fire({
                icon: "error",
                title: "Año inválido",
                text: "Por favor, ingresa un año válido.",
            });
            return;
        }

        
        // Crear FormData
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("portada", portada);
        formData.append("sinopsis", sinopsis);
        formData.append("autor", autor);
        formData.append("anio_publicacion", año);
        formData.append("pdf", pdf);
        categoriasSeleccionadas.forEach((categoriaId) => {
            formData.append("categorias", categoriaId.toString());
        });
        

        console.log("Form data:", ...formData);

        // Enviar la petición
        try {
            const response = await fetch(`${endpoint}/admin/books`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al agregar el libro");
            }

            Swal.fire({
                icon: "success",
                title: "¡Libro agregado!",
                text: "El libro se ha agregado correctamente.",
            }).then(() => {
                navigate("/");
            });
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al agregar el libro.",
            });
        }
    };

    return (
        <div className="container-addbook">
            <img src={img} alt="book" className="addimage" />
            <form className="addbook py-4 px-4" onSubmit={handleSubmit}>
                <h1 className="mb-4">Agregar nuevo libro</h1>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre del libro</label>
                    <input type="text" id="nombre" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="portada" className="form-label">Portada del libro</label>
                    <input type="file" id="portada" className="form-control" accept="image/*" onChange={handleFileChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="sinopsis" className="form-label">Sinopsis</label>
                    <textarea id="sinopsis" className="form-control" value={sinopsis} onChange={(e) => setSinopsis(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="autor" className="form-label">Autor</label>
                    <input type="text" id="autor" className="form-control" value={autor} onChange={(e) => setAutor(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="año" className="form-label">Año de publicación</label>
                    <input type="text" id="año" className="form-control" value={año} onChange={(e) => setAño(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="pdf" className="form-label">Archivo PDF</label>
                    <input type="file" id="pdf" className="form-control" accept="application/pdf" onChange={handlePDFChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Categorías</label>
                    <div className="d-flex flex-wrap gap-2">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria.id}
                                type="button"
                                className={`btn ${
                                    categoriasSeleccionadas.includes(categoria.id)
                                        ? "btn-primary"
                                        : "btn-outline-primary"
                                }`}
                                onClick={() => handleCategoriaClick(categoria.id)}
                            >
                                {categoria.nombre}
                            </button>
                        ))}
                    </div>
                </div>
                <button type="submit" className="btn btn-success">Agregar libro</button>
                <button className="btn btn-warning ms-2" onClick={() => navigate("/")}>Regresar</button>
            </form>
        </div>
    );
}

export default AddBook;