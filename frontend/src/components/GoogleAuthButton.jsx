import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Official Google "G" mark
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 2.9l6-6C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 36.2 26.9 37 24 37c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 40.6 16.2 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.5 36.3 44 30.7 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

// Renders a Tailwind-styled "Continue with Google" button. Uses Google
// Identity Services' OAuth2 token client so the button can be fully custom
// (the default GIS button can't be restyled to match the app's look).
function GoogleAuthButton({ label = "Continue with Google" }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const tokenClientRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initClient = () => {
      if (!window.google?.accounts?.oauth2) return;
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        prompt: "consent",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setError("Google sign-in was cancelled or failed.");
            setLoading(false);
            return;
          }
          try {
            const response = await fetch(`${API_URL}/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: tokenResponse.access_token }),
            });
            const data = await response.json();

            if (!response.ok) {
              setError(data.message || "Google sign-in failed");
              setLoading(false);
              return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            navigate("/dashboard");
          } catch {
            setError("Server error. Please try again later.");
            setLoading(false);
          }
        },
      });
    };

    // The GIS script loads async in index.html, so poll briefly until ready.
    if (window.google?.accounts?.oauth2) {
      initClient();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          initClient();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  const handleClick = () => {
    setError("");
    if (!tokenClientRef.current) {
      setError("Google sign-in is still loading. Please try again in a moment.");
      return;
    }
    setLoading(true);
    tokenClientRef.current.requestAccessToken();
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-2 rounded-lg
        font-semibold border border-gray-300 hover:bg-gray-50 transition duration-300
        disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        {loading ? "Connecting..." : label}
      </button>
      {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
    </div>
  );
}

export default GoogleAuthButton;
