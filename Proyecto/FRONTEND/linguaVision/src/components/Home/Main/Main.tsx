import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import { GrPowerReset } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";

function Main() {
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState("");

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setIsUploading(true);
		setError("");
		setUploadedImages([]); // Limpiar imágenes anteriores

		for (const file of acceptedFiles) {
			if (!file.type.startsWith("image/")) {
				setError("Solo se permiten archivos de imagen");
				setIsUploading(false);
				return;
			}

			const reader = new FileReader();

			reader.onabort = () => {
				setError("Lectura del archivo abortada");
				setIsUploading(false);
			};

			reader.onerror = () => {
				setError("Error al leer el archivo");
				setIsUploading(false);
			};

			reader.onload = () => {
				const imageUrl = reader.result as string;
				setUploadedImages((prev) => [...prev, imageUrl]);
				setIsUploading(false);
			};

			reader.readAsDataURL(file);
		}
	}, []);

	const dropzoneOptions: DropzoneOptions = {
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp"],
		},
		maxFiles: 10,
		multiple: true,
		noClick: uploadedImages.length > 0, // Deshabilitar clicks si hay imágenes
		noKeyboard: uploadedImages.length > 0, // Deshabilitar teclado si hay imágenes
	};

	const { getRootProps, getInputProps, isDragActive } =
		useDropzone(dropzoneOptions);

	const removeImage = (index: number) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
	};

	const resetUpload = () => {
		setUploadedImages([]);
	};

	return (
		<div className="container-main d-flex flex-column align-items-center justify-content-center">
			<div className="container mt-4 bg-light">
				<h2 className="text-center mb-4">Upload your images</h2>

				{uploadedImages.length === 0 ? (
					<div
						{...getRootProps()}
						className={`dropzone ${isDragActive ? "active" : ""} p-5 border-2 border-dashed rounded-3 text-center mb-4`}
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p className="fs-5">Drop images here...</p>
						) : (
							<>
								<p className="fs-5">
                                Drag and drop images here, or click to select
								</p>
								<em className="text-muted">
									(Only images are accepted: .jpeg, .jpg, .png o .webp)
								</em>
							</>
						)}
					</div>
				) : (
					<div className="mt-4">
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h4>Imágenes subidas:</h4>
							<button
								type="button"
								onClick={resetUpload}
								className="btn btn-secondary btn-sm"
							>
								<GrPowerReset /> Reset upload
							</button>
						</div>
						<div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
							{uploadedImages.map((img, index) => (
								<div
									key={`img-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										index
									}`}
									className="col"
								>
									<div className="card h-100">
										<img
											src={img}
											className="card-img-top img-thumbnail"
											alt={`Uploaded ${index}`}
											style={{ height: "200px", objectFit: "cover" }}
										/>
										<div className="card-body d-flex justify-content-center">
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="btn btn-danger btn-sm"
											>
												Eliminar
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				{error && (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				)}

				{isUploading && (
					<div className="text-center my-3">
						{/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">Subiendo...</span>
						</div>
						<p>Procesando imágenes...</p>
					</div>
				)}
			</div>
			<div className="d-flex justify-content-center mt-4">
				<button type="button" className="btn btn-primary mt-4 mx-3 fs-1">
					Upload images <FaCloudUploadAlt />
				</button>
			</div>
		</div>
	);
}

export default Main;
