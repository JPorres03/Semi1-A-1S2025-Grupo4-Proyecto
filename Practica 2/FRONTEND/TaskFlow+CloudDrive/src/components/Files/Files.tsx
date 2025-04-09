import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import txt from "../../assets/txt.png";
import image from "../../assets/image.png";

interface File {
	id: number;
	url: string;
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
				setFiles(Array.isArray(data) ? data : []);
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
			).then(() => {
				navigate("/login");
			});
		}
	}, [userId, navigate]);

	const getFileType = (url: string) => {
		const ext = url.split(".").pop()?.toLowerCase() || "";
		const images = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
		const texts = ["txt", "csv", "json", "xml", "md"];
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

	const convertToBase64 = (file: globalThis.File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () =>
				resolve(reader.result?.toString()?.split(",")[1] || "");
			reader.onerror = reject;
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile({
				id: Date.now(),
				url: URL.createObjectURL(file),
			});
		}
	};

	const handleUpload = async () => {
		if (!selectedFile || !userId) {
			Swal.fire("Error", "Please select a file first", "error");
			return;
		}

		try {
			setUploading(true);
			Swal.fire({
				title: "Uploading file...",
				allowOutsideClick: false,
				didOpen: () => Swal.showLoading(),
			});

			const input = document.querySelector(
				'input[type="file"]',
			) as HTMLInputElement;
			const file = input.files?.[0];
			if (!file) throw new Error("No file selected");

			const base64Data = await convertToBase64(file);

			const payload = {
				idUsuario: userId,
				archivo_base64: base64Data,
				nombre_archivo: file.name,
			};

			const response = await fetch(
				"https://6dhhgxu6zl.execute-api.us-east-1.amazonaws.com/default/Lambda2_pra1",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to upload file");
			}

			const newFile = await response.json();
			setFiles((prev) => [...prev, newFile]);
			setSelectedFile(null);
			input.value = "";

			Swal.fire("Success", "File uploaded successfully", "success");
		} catch (error) {
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
		const type = getFileType(file.url);
		Swal.fire({
			title: "Loading file...",
			allowOutsideClick: false,
			didOpen: () => Swal.showLoading(),
		});

		try {
			if (type === "image") {
				Swal.fire({
					title: extractFileName(file.url),
					imageUrl: file.url,
					imageAlt: "File preview",
					imageHeight: "auto",
					imageWidth: "80%",
					showCloseButton: true,
					showConfirmButton: false,
				});
			} else if (type === "text") {
				const response = await fetch(file.url);
				const content = await response.text();
				Swal.fire({
					title: extractFileName(file.url),
					html: `<pre style="text-align: left; max-height: 400px; overflow: auto;">${content}</pre>`,
					showCloseButton: true,
					confirmButtonText: "Close",
				});
			} else {
				Swal.fire({
					title: extractFileName(file.url),
					text: "This file type cannot be previewed",
					icon: "info",
				});
			}
		} catch {
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
				/>
				<button
					id="btnUpload"
					type="button"
					className="btn mx-5 fs-5 "
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
						const fileType = getFileType(file.url);
						const fileName = extractFileName(file.url);
						const icon =
							fileType === "image"
								? file.url
								: fileType === "text"
									? txt
									: image;

						return (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={file.id}
								className="file-item d-flex flex-column align-items-center"
								style={{ cursor: "pointer", width: "120px" }}
								onClick={() => handleFileClick(file)}
							>
								<img
									src={icon}
									alt={fileName}
									style={{
										width: "100px",
										height: "100px",
										objectFit: fileType === "image" ? "cover" : "contain",
										border: "1px solid #ddd",
										borderRadius: "8px",
									}}
								/>
								<span
									className="mt-2 text-center text-light"
									style={{ fontSize: "0.8rem" }}
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
