import { useState } from "react";
import Swal from "sweetalert2";
import { FaLanguage } from "react-icons/fa";

function Translate() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter text to translate",
      });
      return;
    }

    setIsTranslating(true);
    setError("");

    try {
      // Simulate API call for translation
      // Replace this with your actual translation API call
      const response = await fetch(
        "https://your-translation-api-endpoint.com/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputText,
            target_language: "es", // Example: translate to Spanish
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to translate text");
      }

      const result = await response.json();
      setTranslatedText(result.translatedText || "No translation available");

    } catch (err) {
      setError(`Translation error: ${(err as Error).message}`);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Translation failed: ${(err as Error).message}`,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const resetTranslation = () => {
    setInputText("");
    setTranslatedText("");
  };

  return (
    <div className="container-main d-flex flex-column align-items-center justify-content-center">
      <div className="container mt-4 bg-light">
        <h2 className="text-center mb-4">Text Translation</h2>

        <div className="row">
          {/* Left column for input text */}
          <div className="col-md-6">
            <div className="p-4 border rounded-3" style={{ minHeight: "300px" }}>
              <h4 className="mb-3">Original Text:</h4>
              <textarea
                className="form-control mb-3"
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                disabled={isTranslating}
              />
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetTranslation}
                  disabled={isTranslating}
                >
                  Clear
                </button>
                <div className="text-muted">
                  {inputText.length} characters
                </div>
              </div>
            </div>
          </div>

          {/* Right column for translated text */}
          <div className="col-md-6">
            <div className="p-4 bg-white border rounded-3" style={{ minHeight: "300px" }}>
              <h4 className="mb-3">Translation:</h4>
              {isTranslating ? (
                <div className="d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                  <div className="text-center">
                    {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
<div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Translating...</span>
                    </div>
                    <p>Translating text...</p>
                  </div>
                </div>
              ) : translatedText ? (
                <div className="overflow-auto" style={{ maxHeight: "400px" }}>
                  <pre className="bg-light p-3 rounded" style={{ whiteSpace: "pre-wrap" }}>
                    {translatedText}
                  </pre>
                  <div className="text-end text-muted mt-2">
                    {translatedText.length} characters
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center text-muted" 
                  style={{ height: "200px" }}>
                  <p>Translated text will appear here</p>
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
            disabled={isTranslating || !inputText.trim()}
          >
            Translate Text <FaLanguage /> 
          </button>
        </div>
      </div>
    </div>
  );
}

export default Translate;