import React, { useState, useRef, useEffect } from "react";
import "./URLInput.css";

const URLInput = ({
  onSubmit,
  loading,
  strategy,
  onStrategyChange,
  error,
  onClearError,
}) => {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (error) onClearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!url.trim()) return;
    onSubmit(url.trim());
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    setUrl(pasted);
    if (error) onClearError();
  };

  const handleClear = () => {
    setUrl("");
    setTouched(false);
    if (error) onClearError();
    inputRef.current?.focus();
  };

  const showError = touched && error;
  const inputId = "url-input";

  return (
    <div className="url-input-wrapper">
      {/* Strategy toggle */}
      <div className="strategy-toggle" role="group" aria-label="Analysis strategy">
        <button
          type="button"
          className={`strategy-btn ${strategy === "desktop" ? "active" : ""}`}
          onClick={() => onStrategyChange("desktop")}
          aria-pressed={strategy === "desktop"}
          disabled={loading}
        >
          <i className="bi bi-display" aria-hidden="true"></i>
          Desktop
        </button>
        <button
          type="button"
          className={`strategy-btn ${strategy === "mobile" ? "active" : ""}`}
          onClick={() => onStrategyChange("mobile")}
          aria-pressed={strategy === "mobile"}
          disabled={loading}
        >
          <i className="bi bi-phone" aria-hidden="true"></i>
          Mobile
        </button>
      </div>

      {/* URL form */}
      <form
        className="url-form"
        onSubmit={handleSubmit}
        noValidate
        role="search"
        aria-label="Website URL input form"
      >
        <div className={`url-input-group ${showError ? "has-error" : ""} ${loading ? "loading" : ""}`}>
          {/* Prefix icon */}
          <span className="url-prefix" aria-hidden="true">
            <i className="bi bi-globe2"></i>
          </span>

          {/* Input */}
          <label htmlFor={inputId} className="visually-hidden">
            Enter website URL to analyze
          </label>
          <input
            id={inputId}
            ref={inputRef}
            type="url"
            className="url-input"
            placeholder="https://example.com"
            value={url}
            onChange={handleChange}
            onPaste={handlePaste}
            onBlur={() => setTouched(true)}
            disabled={loading}
            autoComplete="url"
            spellCheck="false"
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? "url-error" : "url-hint"}
          />

          {/* Clear button */}
          {url && !loading && (
            <button
              type="button"
              className="url-clear"
              onClick={handleClear}
              aria-label="Clear URL input"
              tabIndex={0}
            >
              <i className="bi bi-x-circle-fill" aria-hidden="true"></i>
            </button>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="url-submit"
            disabled={loading || !url.trim()}
            aria-label={loading ? "Analyzing website, please wait" : "Analyze website"}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <i className="bi bi-search" aria-hidden="true"></i>
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {showError && (
          <p
            id="url-error"
            className="url-error"
            role="alert"
            aria-live="assertive"
          >
            <i className="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
            {error}
          </p>
        )}

        {/* Hint text */}
        {!showError && (
          <p id="url-hint" className="url-hint">
            <i className="bi bi-info-circle" aria-hidden="true"></i>
            Powered by Google PageSpeed Insights API — free, no sign-up required
          </p>
        )}
      </form>

      {/* Quick example URLs */}
      <div className="quick-urls" aria-label="Quick example URLs">
        <span className="quick-label">Try:</span>
        {["https://web.dev", "https://github.com", "https://vercel.com"].map((example) => (
          <button
            key={example}
            type="button"
            className="quick-url-btn"
            onClick={() => { setUrl(example); if (error) onClearError(); }}
            disabled={loading}
          >
            {example.replace("https://", "")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default URLInput;
