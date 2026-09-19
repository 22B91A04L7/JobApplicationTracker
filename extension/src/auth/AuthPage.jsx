import { useEffect, useState } from "react";

function AuthPage() {
  const [message, setMessage] = useState("Waiting for authentication...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("No authentication token received.");
      setStatus("error");
      return;
    }

    chrome.storage.local.set({ token }, () => {
      if (chrome.runtime.lastError) {
        setMessage("Failed to save authentication.");
        setStatus("error");
        console.error(chrome.runtime.lastError);
        return;
      }

      setMessage("Extension authenticated successfully.");
      setStatus("success");
    });
  }, []);

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-live="polite">
        <div className="auth-brand">
          <div className="brand-mark" aria-hidden="true">
            JT
          </div>
          <span>Job Tracker</span>
        </div>

        <div className={`auth-status auth-status-${status}`} aria-hidden="true">
          {status === "loading" && <span className="auth-spinner" />}
          {status === "success" && (
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="m7.5 12.5 3 3 6-7" />
            </svg>
          )}
          {status === "error" && <span>!</span>}
        </div>

        <h1>
          {status === "success"
            ? "You’re connected"
            : status === "error"
              ? "Connection unsuccessful"
              : "Connecting extension"}
        </h1>
        <p className="auth-message">{message}</p>
        <p className="auth-support">
          {status === "success"
            ? "You can close this page and continue tracking jobs."
            : "Keep this page open while Job Tracker completes the connection."}
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
