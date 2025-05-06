import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import { GrPowerReset } from "react-icons/gr";
import { FaMicrophone } from "react-icons/fa";
import Swal from "sweetalert2";

function Transcribe() {
	const [audioFile, setAudioFile] = useState<File | null>(null);
	const [audioPreview, setAudioPreview] = useState("");
	const [transcribedText, setTranscribedText] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState("");

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setError("");
		setTranscribedText("");

		if (acceptedFiles.length === 0) return;

		const file = acceptedFiles[0];

		// Validate audio file
		if (!file.type.startsWith("audio/")) {
			setError("Only audio files are accepted");
			return;
		}

		setAudioFile(file);

		// Create preview URL
		const previewUrl = URL.createObjectURL(file);
		setAudioPreview(previewUrl);
	}, []);

	const handleSubmit = async () => {
		if (!audioFile) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: "No audio file to transcribe",
			});
			return;
		}

		setIsProcessing(true);
		setError("");

		try {
			// Simulate API call to transcription service
			// Replace with your actual API endpoint
			const formData = new FormData();
			formData.append("audio", audioFile);
			formData.append("language", "en-US"); // Example language code

			const response = await fetch(
				"https://your-transcription-api.com/transcribe",
				{
					method: "POST",
					body: formData,
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to transcribe audio");
			}

			const result = await response.json();
			setTranscribedText(result.text || "No transcription available");
		} catch (err) {
			setError(`Transcription error: ${(err as Error).message}`);
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: `Failed to transcribe audio: ${(err as Error).message}`,
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const resetAll = () => {
		setAudioFile(null);
		setTranscribedText("");
		setError("");
		if (audioPreview) {
			URL.revokeObjectURL(audioPreview);
			setAudioPreview("");
		}
	};

	const dropzoneOptions: DropzoneOptions = {
		onDrop,
		accept: {
			"audio/*": [".mp3", ".wav", ".ogg", ".m4a"],
		},
		maxFiles: 1,
		multiple: false,
	};

	const { getRootProps, getInputProps, isDragActive } =
		useDropzone(dropzoneOptions);

	return (
		<div className="container-main d-flex flex-column align-items-center justify-content-center">
			<div className="container mt-4 bg-light">
				<h2 className="text-center mb-4">Audio Transcription</h2>

				<div className="row">
					{/* Left column for audio upload */}
					<div className="col-md-6">
						{!audioFile ? (
							<div
								{...getRootProps()}
								className={`dropzone ${isDragActive ? "active" : ""} p-5 border-2 border-dashed rounded-3 text-center mb-4`}
								style={{ minHeight: "300px" }}
							>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p className="fs-5">Drop audio file here...</p>
								) : (
									<>
										<p className="fs-5">
											Drag and drop audio file here, or click to select
										</p>
										<em className="text-muted">
											(Supported formats: .mp3, .wav, .ogg, .m4a)
										</em>
									</>
								)}
							</div>
						) : (
							<div className="mt-4">
								<div className="d-flex justify-content-between align-items-center mb-3">
									<h4>Audio File:</h4>
									<button
										type="button"
										onClick={resetAll}
										className="btn btn-secondary btn-sm"
									>
										<GrPowerReset /> Reset
									</button>
								</div>
								<div className="card">
									<div className="card-body">
										{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
										<audio controls className="w-100 mb-3">
											<source src={audioPreview} type={audioFile.type} />
											Your browser does not support the audio element.
										</audio>
										<p className="text-muted mb-0">
											{audioFile.name} (
											{(audioFile.size / 1024 / 1024).toFixed(2)} MB)
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Right column for transcribed text */}
					<div className="col-md-6">
						<div
							className="p-4 bg-white border rounded-3"
							style={{ minHeight: "300px" }}
						>
							<h4 className="mb-3">Transcription:</h4>
							{isProcessing ? (
								<div
									className="d-flex align-items-center justify-content-center"
									style={{ height: "200px" }}
								>
									<div className="text-center">
										{/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
										<div className="spinner-border text-primary" role="status">
											<span className="visually-hidden">Processing...</span>
										</div>
										<p>Transcribing audio...</p>
									</div>
								</div>
							) : transcribedText ? (
								<div className="overflow-auto" style={{ maxHeight: "400px" }}>
									<pre
										className="bg-light p-3 rounded"
										style={{ whiteSpace: "pre-wrap" }}
									>
										{transcribedText}
									</pre>
								</div>
							) : (
								<div
									className="d-flex align-items-center justify-content-center text-muted"
									style={{ height: "200px" }}
								>
									<p>Transcribed text will appear here</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{error && (
					<div className="alert alert-danger mt-3" role="alert">
						{error}
					</div>
				)}

				<div className="d-flex justify-content-center mt-4">
					<button
						type="button"
						className="btn btn-primary mt-4 mx-3 fs-1"
						onClick={handleSubmit}
						disabled={isProcessing || !audioFile}
					>
						Transcribe Audio <FaMicrophone />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Transcribe;
