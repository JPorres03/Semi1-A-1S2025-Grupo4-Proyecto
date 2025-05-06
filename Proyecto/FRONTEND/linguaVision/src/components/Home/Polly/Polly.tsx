import { useState, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import { FaVolumeUp } from "react-icons/fa";

function Polly() {
  const [inputText, setInputText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const resetConversion = useCallback(() => {
    setInputText("");
    setAudioUrl("");
    setError("");
    setCharCount(0);
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    setCharCount(inputText.length);
  }, [inputText]);

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
      const response = await fetch(
        "https://l4mu3jie40.execute-api.us-east-1.amazonaws.com/generate-audio",
        {
          method: "POST",
          
          body: JSON.stringify({
            text: inputText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Obtener el contenido como blob directamente
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Speech synthesis error: ${errorMessage}`);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to convert text to speech: ${errorMessage}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-main d-flex flex-column align-items-center justify-content-center min-vh-100 py-4">
      <div className="container bg-light rounded shadow p-4" style={{ maxWidth: "1200px" }}>
        <h2 className="text-center mb-4">Text to Speech Converter</h2>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="h-100 p-4 border rounded-3 bg-white">
              <h4 className="mb-3">Enter Text:</h4>
              <textarea
                className="form-control mb-3"
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                disabled={isProcessing}
                aria-label="Text input for speech conversion"
              />
              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetConversion}
                  disabled={isProcessing}
                  aria-label="Clear text"
                >
                  Clear
                </button>
                <small className="text-muted">
                  {charCount} character{charCount !== 1 ? "s" : ""}
                </small>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="h-100 p-4 border rounded-3 bg-white">
              <h4 className="mb-3">Audio Output:</h4>
              {isProcessing ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
<div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Processing...</span>
                  </div>
                  <p className="mt-2">Converting text to speech...</p>
                </div>
              ) : audioUrl ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
<audio controls className="w-100 mb-3" aria-label="Audio output">
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <a
                    href={audioUrl}
                    download={`speech-${new Date().toISOString().slice(0, 10)}.mp3`}
                    className="btn btn-success"
                    aria-label="Download audio"
                  >
                    Download MP3
                  </a>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
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
            className="btn btn-primary btn-lg d-flex align-items-center gap-2"
            onClick={handleSubmit}
            disabled={isProcessing || !inputText.trim()}
            aria-label="Convert text to speech"
          >
            <span>Convert to Speech</span>
            <FaVolumeUp />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Polly;