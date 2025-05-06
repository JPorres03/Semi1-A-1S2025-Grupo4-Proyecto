import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import { GrPowerReset } from "react-icons/gr";
import { FcProcess } from "react-icons/fc";
import Swal from "sweetalert2";

function Main() {
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [extractedText, setExtractedText] = useState<string[]>([]); // New state for extracted text

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setIsUploading(true);
		setError("");
		setUploadedImages([]);
		setFiles(acceptedFiles);
		setExtractedText([]); // Clear previous extracted text when new files are added

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

	const handleSubmit = async () => {
		if (files.length === 0) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: "No hay imágenes para subir",
			});
			return;
		}

		setIsUploading(true);
		setExtractedText([]); // Clear previous results

		try {
			// Process each image
			const uploadPromises = files.map(async (file) => {
				const base64String = await convertToBase64(file);

				const response = await fetch(
					"https://hvfxmfh1y1.execute-api.us-east-2.amazonaws.com/$default/semi1lambda1",
					{
						method: "POST",
						mode: "cors",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							user_id: 123,
							image: base64String.split(",")[1] || base64String,
						}),
					},
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Failed to upload image");
				}

				return await response.json();
			});

			const results = await Promise.all(uploadPromises);

			// Extract text from results and update state
			const texts = results.map((result) => result.text || "No text found");
			setExtractedText(texts);

			await Swal.fire({
				icon: "success",
				title: "Éxito",
				text: `Se procesaron ${results.length} imágenes correctamente`,
			});
		} catch (err) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: `Ocurrió un error al procesar las imágenes: ${(err as Error).message}`,
			});
		} finally {
			setIsUploading(false);
		}
	};

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const dropzoneOptions: DropzoneOptions = {
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp"],
		},
		maxFiles: 10,
		multiple: true,
		noClick: uploadedImages.length > 0,
		noKeyboard: uploadedImages.length > 0,
	};

	const { getRootProps, getInputProps, isDragActive } =
		useDropzone(dropzoneOptions);

	const removeImage = (index: number) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
		setFiles((prev) => prev.filter((_, i) => i !== index));
		setExtractedText((prev) => prev.filter((_, i) => i !== index)); // Also remove corresponding text
	};

	const resetUpload = () => {
		setUploadedImages([]);
		setFiles([]);
		setExtractedText([]);
	};

	return (
		<div className="container-main d-flex flex-column align-items-center justify-content-center">
			<div className="container mt-4 bg-light">
				<h2 className="text-center mb-4">Extract text from images</h2>

				<div className="row">
					{/* Left column for drag and drop */}
					<div className="col-md-6">
						{uploadedImages.length === 0 ? (
							<div
								{...getRootProps()}
								className={`dropzone ${isDragActive ? "active" : ""} p-5 border-2 border-dashed rounded-3 text-center mb-4`}
								style={{ minHeight: "300px" }}
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
									<h4>Uploaded Images:</h4>
									<button
										type="button"
										onClick={resetUpload}
										className="btn btn-secondary btn-sm"
									>
										<GrPowerReset /> Reset upload
									</button>
								</div>
								<div className="row row-cols-1 row-cols-md-2 g-4">
									{uploadedImages.map((img, index) => (
										<div key={`img-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
index}`} className="col">
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
					</div>

					{/* Right column for extracted text */}
					<div className="col-md-6">
						<div
							className="p-4 bg-white border rounded-3"
							style={{ minHeight: "300px" }}
						>
							<h4 className="mb-3">Extracted Text:</h4>
							{extractedText.length > 0 ? (
								<div className="overflow-auto" style={{ maxHeight: "500px" }}>
									{extractedText.map((text, index) => (
										<div
											key={`text-${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
index}`}
											className="mb-3 p-3 border-bottom"
										>
											<h6>Image {index + 1}:</h6>
											<pre
												className="bg-light p-2 rounded"
												style={{ whiteSpace: "pre-wrap" }}
											>
												{text}
											</pre>
										</div>
									))}
								</div>
							) : (
								<div
									className="d-flex align-items-center justify-content-center text-muted"
									style={{ height: "200px" }}
								>
									{isUploading ? (
										<div className="text-center">
											<div
												className="spinner-border text-primary"
												// biome-ignore lint/a11y/useSemanticElements: <explanation>
												role="status"
											>
												<span className="visually-hidden">Processing...</span>
											</div>
											<p>Extracting text...</p>
										</div>
									) : (
										<p>Text extracted from images will appear here</p>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{error && (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				)}
			</div>
			<div className="d-flex justify-content-center mt-4">
				<button
					type="button"
					className="btn btn-primary mt-4 mx-3 fs-1"
					onClick={handleSubmit}
					disabled={isUploading || uploadedImages.length === 0}
				>
					Process <FcProcess />
				</button>
			</div>
		</div>
	);
}

export default Main;
