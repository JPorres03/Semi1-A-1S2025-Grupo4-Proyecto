import { useState } from "react";
import Swal from "sweetalert2";
import { FaLanguage } from "react-icons/fa";

function Translate() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en"); // Idioma por defecto: inglés

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
      const response = await fetch(
        "https://u3a27iijvi.execute-api.us-east-2.amazonaws.com/default/semi1lambda2",
        {
          method: "POST",
          body: JSON.stringify({
            text: inputText,
            targetLanguage: targetLanguage,
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

        {/* Selector de idioma */}
        <div className="row mb-4">
          <div className="col-md-6 offset-md-3">
            <div className="form-group">
              <label htmlFor="languageSelect" className="form-label">
                Target Language:
              </label>
              <select
                id="languageSelect"
                className="form-select"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={isTranslating}
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
          {/* Columna izquierda para el texto original */}
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

          {/* Columna derecha para el texto traducido */}
          <div className="col-md-6">
            <div className="p-4 bg-white border rounded-3" style={{ minHeight: "300px" }}>
              <h4 className="mb-3">Translation ({languageOptions.find(lang => lang.code === targetLanguage)?.name}):</h4>
              {isTranslating ? (
                <div className="d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                  <div className="text-center">
                    {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
<div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Translating...</span>
                    </div>
                    <p>Translating text to {languageOptions.find(lang => lang.code === targetLanguage)?.name}...</p>
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