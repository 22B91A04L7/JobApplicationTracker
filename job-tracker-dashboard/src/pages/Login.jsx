import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EXTENSION_ID } from "../config";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token); // saving token to local storage

      //sending token via msg to extension
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        {
          type: "AUTHENTICATE",
          token: data.token,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.warn(
              "Could not authenticate extension:",
              chrome.runtime.lastError.message,
            );
            return;
          }

          console.log("Extension authentication:", response);
        },
      );

      navigate("/jobs");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true">
            AT
          </span>
          <span>ATrackie</span>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to your workspace</h1>
          <p>Keep your next opportunity organized and moving forward.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin} aria-busy={loading}>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading && <span className="button-spinner" aria-hidden="true" />}
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
