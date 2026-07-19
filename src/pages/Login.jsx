import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setStatus("Enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      navigate("/");
    } catch (error) {
      setStatus(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setStatus("");

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      setStatus(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((currentMode) =>
      currentMode === "login" ? "register" : "login"
    );

    setPassword("");
    setStatus("");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-eyebrow">Random Reads Account</p>

        <h1>
          {mode === "login"
            ? "Welcome back."
            : "Create your account."}
        </h1>

        <p className="login-description">
          {mode === "login"
            ? "Sign in to access your saved books, reading progress, and journal."
            : "Create an account to save your books, progress, and journal across devices."}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="reader@example.com"
            autoComplete="email"
            disabled={loading}
          />

          <label htmlFor="login-password">Password</label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            autoComplete={
              mode === "login"
                ? "current-password"
                : "new-password"
            }
            disabled={loading}
          />

          {status && (
            <p className="login-status" role="alert">
              {status}
            </p>
          )}

          <button
            className="login-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : "Create Account"}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          className="login-google-button"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        <p className="login-switch">
          {mode === "login"
            ? "New to Random Reads?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={switchMode}
            disabled={loading}
          >
            {mode === "login"
              ? "Create an account"
              : "Log in"}
          </button>
        </p>
      </section>
    </main>
  );
}

function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists with that email.";

    case "auth/invalid-email":
      return "Enter a valid email address.";

    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password is incorrect.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    case "auth/popup-blocked":
      return "The browser blocked the Google sign-in window.";

    case "auth/unauthorized-domain":
      return "This website is not authorized for Firebase login.";

    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";

    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";

    default:
      console.error("Firebase authentication error:", code);
      return "Unable to complete login. Please try again.";
  }
}
