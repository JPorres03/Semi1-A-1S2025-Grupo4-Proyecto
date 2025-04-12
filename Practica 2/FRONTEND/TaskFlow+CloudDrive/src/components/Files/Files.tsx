import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import txt from "../../assets/txt.png";
import image from "../../assets/image.png";

interface File {
	file_id: number;
	file_user_id: number;
	file_url: string;
	file_content?: string;
	file_name?: string;
}

function Files() {
	const [files, setFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const userId = sessionStorage.getItem("userId");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFiles = async () => {
			try {
				Swal.fire({
					title: "Loading files...",
					allowOutsideClick: false,
					didOpen: () => Swal.showLoading(),
				});

				const response = await fetch(
					`http://localhost:3001/api/files/${userId}`,
				);
				if (!response.ok) throw new Error("Failed to fetch files");

				const data = await response.json();

				// Procesar archivos para extraer contenido si es texto
				const processedFiles = Array.isArray(data.files)
					? data.files.map((file: File) => {
							if (getFileType(file.file_url) === "text") {
								return {
									...file,
									file_name: extractFileName(file.file_url),
									// Si AWS devuelve el contenido en otro campo, ajústalo aquí
									file_content: file.file_content || "",
								};
							}
							return file;
						})
					: [];

				setFiles(processedFiles);
				Swal.close();
			} catch (error) {
				console.error("Error fetching files:", error);
				Swal.fire(
					"Error",
					"Failed to load files. Please try again later.",
					"error",
				);
			} finally {
				setLoading(false);
			}
		};

		if (userId) {
			fetchFiles();
		} else {
			Swal.fire(
				"Authentication required",
				"Please log in to access your files",
				"warning",
			).then(() => navigate("/login"));
		}
	}, [userId, navigate]);

	const getFileType = (url: string) => {
		const ext = url.split(".").pop()?.toLowerCase() || "";
		const images = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
		const texts = [
			"txt",
			"csv",
			"json",
			"xml",
			"md",
			"html",
			"js",
			"ts",
			"css",
		];

		if (images.includes(ext)) return "image";
		if (texts.includes(ext)) return "text";
		return "unknown";
	};

	const extractFileName = (url: string) => {
		return (url.split("/").pop() ?? "Unknown")
			.split(".")[0]
			.replace(/[_-]/g, " ")
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			Swal.fire("Error", "File size should be less than 5MB", "error");
			e.target.value = "";
			return;
		}

		setSelectedFile({
			file_id: Date.now(),
			file_user_id: Number(userId),
			file_url: URL.createObjectURL(file),
			file_name: file.name,
		});
	};

	const convertToBase64 = (file: globalThis.File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				const base64Data = result.split(",")[1] || "";
				resolve(base64Data);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleUpload = async () => {
		if (!selectedFile || !userId) {
			Swal.fire("Error", "Please select a file first", "error");
			return;
		}

		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			Swal.fire("Error", "No file selected", "error");
			return;
		}

		try {
			setUploading(true);
			Swal.fire({
				title: "Uploading file...",
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});

			const base64Data = await convertToBase64(file);
			const payload = {
				id_usuario: userId,
				archivo_base64: base64Data,
				nombre_archivo: file.name,
			};

			const response = await fetch(
				"https://xf5kbcaya3.execute-api.us-east-1.amazonaws.com/default/Lambda2_pra1",
				{
					method: "POST",
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to upload file");
			}

			const responseData = await response.json();

			// Manejar diferentes formatos de respuesta
			const newFile = {
				file_id: responseData.file_id || Date.now(),
				file_user_id: Number(userId),
				file_url: responseData.file_url || file.name,
				file_name: file.name,
				file_content:
					typeof responseData === "string"
						? responseData
						: responseData.content,
			};

			setFiles((prev) => [...prev, newFile]);
			setSelectedFile(null);
			input.value = "";

			Swal.fire("Success", "File uploaded successfully", "success");
		} catch (error) {
			console.error("Upload error:", error);
			Swal.fire(
				"Error",
				error instanceof Error ? error.message : "Upload failed",
				"error",
			);
		} finally {
			setUploading(false);
		}
	};

	const handleFileClick = async (file: File) => {
		const type = getFileType(file.file_url);
		Swal.fire({
			title: "Loading file...",
			allowOutsideClick: false,
			didOpen: () => Swal.showLoading(),
		});

		try {
			if (type === "image") {
				Swal.fire({
					title: file.file_name || extractFileName(file.file_url),
					imageUrl: file.file_url,
					imageAlt: "File preview",
					imageHeight: "auto",
					imageWidth: "80%",
					showCloseButton: true,
					showConfirmButton: false,
				});
			} else if (type === "text") {
				const response = await fetch(file.file_url);
				if (!response.ok) throw new Error("Failed to fetch file content");
				const content = await response.text();

				Swal.fire({
					title: file.file_name || extractFileName(file.file_url),
					html: `
              <div style="
                text-align: left; 
                max-height: 60vh; 
                overflow: auto; 
                white-space: pre-wrap; 
                font-family: monospace;
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                border: 1px solid #ddd;
              ">
                ${content}
              </div>
            `,
					showCloseButton: true,
					confirmButtonText: "Close",
					width: "80%",
				});
			} else {
				Swal.fire({
					title: file.file_name || extractFileName(file.file_url),
					text: "This file type cannot be previewed",
					icon: "info",
				});
			}
		} catch (error) {
			console.error("Error loading file:", error);
			Swal.fire("Error", "Could not load file content", "error");
		}
	};
	if (loading) {
		return (
			<div
				className="d-flex flex-column align-items-center justify-content-center"
				style={{ minHeight: "60vh" }}
			>
				<div className="spinner-border text-primary" role="status" />
				<p className="text-light mt-3">Loading your files...</p>
			</div>
		);
	}

	return (
		<div className="d-flex flex-column align-items-center justify-content-center">
			<div className="d-flex flex-row align-items-center justify-content-center mb-3 w-100">
				<input
					type="file"
					className="form-control w-50"
					onChange={handleFileChange}
					disabled={uploading}
					accept=".txt,.csv,.json,.xml,.md,.html,.js,.ts,.css,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg"
				/>
				<button
					id="btnUpload"
					type="button"
					className="btn mx-5 fs-5"
					onClick={handleUpload}
					disabled={!selectedFile || uploading}
				>
					{uploading ? (
						<>
							<span
								className="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
							/>
							Uploading...
						</>
					) : (
						"Upload file"
					)}
				</button>
			</div>

			<div className="filesContainer d-flex flex-wrap justify-content-center gap-4 p-4">
				{!loading && files.length === 0 ? (
					<div className="text-light fs-5">
						No files uploaded yet. Select a file to upload.
					</div>
				) : (
					files.map((file) => {
						const fileType = getFileType(file.file_url);
						const fileName = file.file_name || extractFileName(file.file_url);
						const icon =
							fileType === "image"
								? file.file_url
								: fileType === "text"
									? txt
									: image;

						return (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={file.file_id}
								className="file-item d-flex flex-column align-items-center p-2"
								style={{
									cursor: "pointer",
									width: "120px",
									transition: "transform 0.2s",
									borderRadius: "8px",
								}}
								onMouseEnter={(e) =>
									// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
									(e.currentTarget.style.transform = "scale(1.05)")
								}
								onMouseLeave={(e) =>
									// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
									(e.currentTarget.style.transform = "scale(1)")
								}
								onClick={() => handleFileClick(file)}
							>
								<div
									style={{
										width: "100px",
										height: "100px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "#f8f9fa",
										borderRadius: "8px",
										overflow: "hidden",
									}}
								>
									<img
										src={icon}
										alt={fileName}
										style={{
											maxWidth: "100%",
											maxHeight: "100%",
											objectFit: fileType === "image" ? "cover" : "contain",
										}}
									/>
								</div>
								<span
									className="mt-2 text-center text-light"
									style={{
										fontSize: "0.8rem",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
										width: "100%",
									}}
								>
									{fileName}
								</span>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

export default Files;
