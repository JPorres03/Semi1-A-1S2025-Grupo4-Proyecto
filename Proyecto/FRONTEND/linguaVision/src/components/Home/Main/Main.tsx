import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import { GrPowerReset } from "react-icons/gr";
import { FcProcess } from "react-icons/fc";
import Swal from "sweetalert2";

// Define the expected Lambda response type
interface LambdaResponse {
	translatedText?: string;
}

function Main() {
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [extractedText, setExtractedText] = useState<string[]>([]);
	const [targetLanguage, setTargetLanguage] = useState("en"); // Default language: English

	const languageOptions = [
		{ code: "en", name: "English" },
		{ code: "es", name: "Spanish" },
		{ code: "fr", name: "French" },
		{ code: "de", name: "German" },
		{ code: "it", name: "Italian" },
		{ code: "pt", name: "Portuguese" },
		{ code: "ja", name: "Japanese" },
		{ code: "zh", name: "Chinese" },
	];

	const navigate = useNavigate();

	// Authentication check
	useEffect(() => {
		const checkAuth = () => {
			const user = sessionStorage.getItem("user");
			if (!user) {
				navigate("/login");
			}
		};

		checkAuth();
		window.addEventListener("storage", checkAuth);

		return () => {
			window.removeEventListener("storage", checkAuth);
		};
	}, [navigate]);

	// Handle file drop
	const onDrop = useCallback((acceptedFiles: File[]) => {
		setIsUploading(true);
		setError("");
		const validFiles: File[] = [];
		const validImages: string[] = [];

		for (const file of acceptedFiles) {
			if (!file.type.startsWith("image/")) {
				// biome-ignore lint/style/useTemplate: <explanation>
				setError((prev) => prev + `File ${file.name} is not an image. `);
				continue;
			}

			validFiles.push(file);
			const reader = new FileReader();

			reader.onabort = () => {
				// biome-ignore lint/style/useTemplate: <explanation>
				setError((prev) => prev + `File ${file.name} reading aborted. `);
				setIsUploading(false);
			};

			reader.onerror = () => {
				// biome-ignore lint/style/useTemplate: <explanation>
				setError((prev) => prev + `Error reading file ${file.name}. `);
				setIsUploading(false);
			};

			reader.onload = () => {
				const imageUrl = reader.result as string;
				validImages.push(imageUrl);
				setUploadedImages([...validImages]);
				setIsUploading(false);
			};

			reader.readAsDataURL(file);
		}

		setFiles(validFiles);
	}, []);

	// Convert file to base64
	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				const result = reader.result as string;
				if (!result || !result.includes("base64,")) {
					reject(new Error("Invalid base64 string"));
				}
				resolve(result.split(",")[1] || result);
			};
			reader.onerror = (error) => reject(error);
		});
	};

	// Handle image processing
	const handleSubmit = async () => {
		if (files.length === 0) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: "No images to upload",
			});
			return;
		}

		setIsUploading(true);
		setExtractedText([]);

		try {
			const uploadPromises = files.map(async (file, index) => {
				await new Promise((resolve) => setTimeout(resolve, index * 100)); // Stagger requests
				const base64String = await convertToBase64(file);
				const response = await fetch(
					"https://hvfxmfh1y1.execute-api.us-east-2.amazonaws.com/$default/semi1lambda1",
					{
						method: "POST",
						
						body: JSON.stringify({
							targetLanguage: targetLanguage,
							image: base64String,
						}),
					},
				);

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.message || `Failed to process image ${file.name}`,
					);
				}

				return await response.json();
			});

			const results = await Promise.all<LambdaResponse>(uploadPromises);
			const texts = results.map((result) =>
				result && typeof result === "object" && "translatedText" in result
					? result.translatedText || "No text found"
					: "Invalid response from server",
			);
			setExtractedText(texts);

			await Swal.fire({
				icon: "success",
				title: "Success",
				text: `${results.length} images processed successfully`,
			});
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: `Error processing images: ${errorMessage}`,
			});
		} finally {
			setIsUploading(false);
		}
	};

	// Dropzone configuration
	const dropzoneOptions: DropzoneOptions = {
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp"],
		},
		maxFiles: 10,
		multiple: true,
		noClick: uploadedImages.length > 0 || isUploading,
		noKeyboard: uploadedImages.length > 0 || isUploading,
		disabled: isUploading,
	};

	const { getRootProps, getInputProps, isDragActive } =
		useDropzone(dropzoneOptions);

	// Remove an image
	const removeImage = (index: number) => {
		setUploadedImages((prev) => prev.filter((_, i) => i !== index));
		setFiles((prev) => prev.filter((_, i) => i !== index));
		setExtractedText((prev) => prev.filter((_, i) => i !== index));
	};

	// Reset upload state
	const resetUpload = () => {
		setUploadedImages([]);
		setFiles([]);
		setExtractedText([]);
	};

	return (
		<div className="container-main d-flex flex-column align-items-center justify-content-center">
			<div className="container mt-4 bg-light">
				<h2 className="text-center mb-4">Extract text from images</h2>

				{/* Language selector */}
				<div className="row mb-4">
					<div className="col-md-6 offset-md-3">
						<div className="form-group">
							<label htmlFor="languageSelect" className="form-label">
								Translation Language:
							</label>
							<select
								id="languageSelect"
								className="form-select"
								value={targetLanguage}
								onChange={(e) => setTargetLanguage(e.target.value)}
								disabled={isUploading}
							>
								{languageOptions.map((lang) => (
									<option key={lang.code} value={lang.code}>
										{lang.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

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
											(Only images are accepted: .jpeg, .jpg, .png, .webp)
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
														Remove
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
							<h4 className="mb-3">
								Extracted Text (
								{
									languageOptions.find((lang) => lang.code === targetLanguage)
										?.name
								}
								):
							</h4>
							{isUploading ? (
								<div
									className="d-flex align-items-center justify-content-center"
									style={{ height: "200px" }}
								>
									<div className="text-center">
										<div
											className="spinner-border text-primary"
											// biome-ignore lint/a11y/useSemanticElements: <explanation>
											role="status"
											aria-busy="true"
											aria-label="Processing images"
										>
											<span className="visually-hidden">Processing...</span>
										</div>
										<p>
											Extracting text and translating to{" "}
											{
												languageOptions.find(
													(lang) => lang.code === targetLanguage,
												)?.name
											}
											...
										</p>
									</div>
								</div>
							) : extractedText.length > 0 ? (
								<div className="overflow-auto" style={{ maxHeight: "500px" }}>
									{extractedText.map((text, index) => (
										<div
											key={`text-${
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												index
											}`}
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
									<p>Extracted and translated text will appear here</p>
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
					aria-label="Process images"
				>
					Process <FcProcess />
				</button>
			</div>
		</div>
	);
}

export default Main;
