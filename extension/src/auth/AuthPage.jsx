import { useEffect, useState } from "react";

function AuthPage() {
  const [message, setMessage] = useState("Waiting for authentication...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("No authentication token received.");
      return;
    }

    chrome.storage.local.set({ token }, () => {
      if (chrome.runtime.lastError) {
        setMessage("Failed to save authentication.");
        console.error(chrome.runtime.lastError);
        return;
      }

      setMessage("Extension authenticated successfully.");
    });
  }, []);

  return (
    <main>
      <h1>Job Tracker</h1>
      <p>{message}</p>
    </main>
  );
}

export default AuthPage;
