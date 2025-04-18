"use client";

import { useState, FormEvent, CSSProperties } from "react";

export default function Home() {
  const [alias, setAlias] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isValidationError, setIsValidationError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      maxWidth: "50%",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    },
    title: {
      textAlign: "center",
      color: "#cfaaf9",
      marginBottom: "2rem",
      fontSize: "40px",
      fontWeight: "bold"

    },
    form: {
      backgroundColor: "#cfaaf9",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "10px 10px 10px rgba(87, 5, 179, 1)"
    },
    inputGroup: {
      marginBottom: "1.5rem"
    },
    label: {
      display: "block",
      marginBottom: "10px",
      fontWeight: "bold",
      color: "black",
      fontSize: "25px",
      fontStyle: "italic"
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      border: "3px solid #5705b3",
      borderRadius: "6px",
      marginTop: "0.5rem"
    },
    button: {
      backgroundColor: "#5705b3",
      color: "white",
      fontWeight: "bold",
      padding: "10px",
      fontSize: "calc(1px + 2vw)",
      borderRadius: "6px",
      width: "100%"
    },
    retryButton: {
      backgroundColor: "#f44336",
      fontWeight: "bold",
      padding: "10px",
      fontSize: "calc(1px + 3vw)",
      borderRadius: "6px",
      width: "100%",
      color: "white",
    },
    error: {
      color: "#f44336",
      margin: "10px",
      padding: "10px",
      backgroundColor: "rgba(244, 67, 54, 0.1)",
      borderRadius: "4px"
    },
    resultSection: {
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#5705b3",
      borderRadius: "4px",

    },
    shortUrl: {
      marginBottom: "10px",
      fontWeight: "bold",
      fontSize: "15px",
    },
    link: {
      color: "#4a90e2",
      display: "flex",
      justifyContent: "center",
      textDecoration: "none",
      fontStyle: "italic",
      fontSize: "20px",
      fontWeight: "bold",
    },
    copyButton: {
      backgroundColor: "#28a745",
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      fontWeight: "bold",
      fontSize: "20px",
    },
    copySuccess: {
      color: "white",
      textAlign: "center",
      marginTop: "10px",
      fontWeight: "bold",
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setIsValidationError(true);
      setError("URL must start with http:// or https:// to continue");
      return;
    }

    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.endsWith(".net")) {
        setIsValidationError(true);
        setError("This URL is not allowed");
        return;
      }
    } catch {
      setIsValidationError(true);
      setError("Invalid URL format");
      return;
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, url }),
      });

      const data = await res.json();

      if (data.error) {
        if (data.error === "Alias is already in use") {
          setIsValidationError(true);
          setError(data.error);
          return;
        }
        setIsValidationError(true);
        throw new Error(data.error);
      }

      setShortUrl(`${window.location.origin}/${data.alias}`);
    } catch (err) {
      setIsValidationError(true);
      setError(err instanceof Error ? err.message : "Failed to create URL");
    }
  };

  const handleRetry = () => {
    setError("");
    setUrl("");
    setAlias("");
    setIsValidationError(false);
    setCopySuccess(false);
  };

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopySuccess(true);
  };

  return (
      <main style={styles.container}>
        <h1 style={styles.title}>URL Shortener</h1>

        {isValidationError ? (
            <div>
              <p style={styles.error}>{error}</p>
              <button type="button" onClick={handleRetry} style={styles.retryButton}
              >
                Clear and Try Again
              </button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Custom Alias:
                  <input
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="my-alias"
                      style={styles.input}
                  />
                </label>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Destination URL:
                  <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      required
                      style={styles.input}
                  />
                </label>
              </div>

              <button type="submit" style={styles.button}>
                Shorten URL
              </button>

              {shortUrl && (
                  <section style={styles.resultSection}>
                    <p style={styles.shortUrl}>
                      Your short URL:{" "}
                      <a href={shortUrl} target="_blank" style={styles.link}>
                        {shortUrl}
                      </a>
                    </p>
                    <button type="button" onClick={copyToClipboard} style={styles.copyButton}>
                      Copy
                    </button>
                    {copySuccess && (
                        <p style={styles.copySuccess}>Copied to clipboard!</p>
                    )}
                  </section>
              )}
            </form>
        )}
      </main>
  );
}