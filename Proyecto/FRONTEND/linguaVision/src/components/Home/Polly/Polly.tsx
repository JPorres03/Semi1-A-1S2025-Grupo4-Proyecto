import { useState } from "react";
import Swal from "sweetalert2";
import { FaVolumeUp } from "react-icons/fa";

function Polly() {
	const [inputText, setInputText] = useState("");
	const [audioUrl, setAudioUrl] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		if (!inputText.trim()) {
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: "Please enter text to convert to speech",
			});
			return;
		}

		setIsProcessing(true);
		setError("");
		setAudioUrl("");

		try {
			// Simulate API call to AWS Polly or similar service
			// Replace this with your actual API endpoint
			const response = await fetch(
				"https://your-polly-api-endpoint.com/synthesize",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						text: inputText,
						voice: "Joanna", // Example voice
						outputFormat: "mp3", // Example format
					}),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to synthesize speech");
			}

			// Assuming the API returns the audio file directly
			const audioBlob = await response.blob();
			const url = URL.createObjectURL(audioBlob);
			setAudioUrl(url);
		} catch (err) {
			setError(`Speech synthesis error: ${(err as Error).message}`);
			await Swal.fire({
				icon: "error",
				title: "Error",
				text: `Failed to convert text to speech: ${(err as Error).message}`,
			});
		} finally {
			setIsProcessing(false);
		}
	};

	const resetConversion = () => {
		setInputText("");
		setAudioUrl("");
		// Revoke the object URL to avoid memory leaks
		if (audioUrl) {
			URL.revokeObjectURL(audioUrl);
		}
	};

	return (
		<div className="container-main d-flex flex-column align-items-center justify-content-center">
			<div className="container mt-4 bg-light">
				<h2 className="text-center mb-4">Text to Speech</h2>

				<div className="row">
					{/* Left column for input text */}
					<div className="col-md-6">
						<div
							className="p-4 border rounded-3"
							style={{ minHeight: "300px" }}
						>
							<h4 className="mb-3">Enter Text:</h4>
							<textarea
								className="form-control mb-3"
								rows={10}
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								placeholder="Enter text to convert to speech..."
								disabled={isProcessing}
							/>
							<div className="d-flex justify-content-between">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={resetConversion}
									disabled={isProcessing}
								>
									Clear
								</button>
								<div className="text-muted">{inputText.length} characters</div>
							</div>
						</div>
					</div>

					{/* Right column for audio output */}
					<div className="col-md-6">
						<div
							className="p-4 bg-white border rounded-3"
							style={{ minHeight: "300px" }}
						>
							<h4 className="mb-3">Audio Output:</h4>
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
										<p>Converting text to speech...</p>
									</div>
								</div>
							) : audioUrl ? (
								<div className="d-flex flex-column align-items-center justify-content-center">
									{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
									<audio controls className="w-100 mb-3">
										<source src={audioUrl} type="audio/mpeg" />
										Your browser does not support the audio element.
									</audio>
									<a
										href={audioUrl}
										download="speech.mp3"
										className="btn btn-success"
									>
										Download MP3
									</a>
								</div>
							) : (
								<div
									className="d-flex align-items-center justify-content-center text-muted"
									style={{ height: "200px" }}
								>
									<p>Audio output will appear here</p>
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
						disabled={isProcessing || !inputText.trim()}
					>
						Convert to Speech <FaVolumeUp />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Polly;
