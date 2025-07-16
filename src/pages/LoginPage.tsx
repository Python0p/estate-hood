import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_API_URL = import.meta.env.REACT_APP_API_URL;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check if login token present in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setIsWaiting(true);
      fetch(`${BACKEND_API_URL}/api/v1/user/verify-login?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            navigate("/");
          } else {
            setErrorMsg(data.message || "Invalid or expired login link.");
            setIsWaiting(false);
          }
        })
        .catch(() => {
          setErrorMsg("Something went wrong while verifying login.");
          setIsWaiting(false);
        });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const sessionNonce = crypto.randomUUID();

    localStorage.setItem("loginEmail", email);
    localStorage.setItem("loginSessionNonce", sessionNonce);

    try {
      const res = await fetch(`${BACKEND_API_URL}/api/v1/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionNonce }),
      });

      const data = await res.json();
      if (res.ok) {
        setCountdown(300);
        setTimeExpired(false);
        setIsWaiting(true);
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem("loginEmail");
    const sessionNonce = crypto.randomUUID();
    if (!email || !sessionNonce) return;

    localStorage.setItem("loginSessionNonce", sessionNonce);
    setResending(true);
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/v1/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sessionNonce }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Login link resent");
        setCountdown(300);
        setTimeExpired(false);
        setIsWaiting(false);
        setTimeout(() => setIsWaiting(true), 50);
      } else {
        alert(data.message || "Could not resend login link");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!isWaiting) return;

    const sessionNonce = localStorage.getItem("loginSessionNonce");
    const poller = setInterval(async () => {
      try {
        const res = await fetch(
          `${BACKEND_API_URL}/api/v1/user/verify-login?sessionNonce=${sessionNonce}`
        );
        const data = await res.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          clearInterval(poller);
          navigate("/");
        }
      } catch {}
    }, 5000);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(poller);
          setTimeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(poller);
      clearInterval(timer);
    };
  }, [isWaiting, navigate]);

  if (isWaiting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">Check your email</h2>
        <p className="text-white/80 mb-6">
          We've sent a login link to <strong>{email}</strong>.
        </p>

        <p className="text-lg font-semibold text-yellow-300 mb-2">
          Time Remaining:{" "}
          {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
        </p>

        {timeExpired && (
          <div className="mt-6">
            <p className="text-red-400 mb-2 font-semibold">
              ⌛ Link expired. You can resend below.
            </p>
            <button
              onClick={handleResend}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend Login Link"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen flex items-center justify-center px-4">
      {/* Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.5] saturate-[1.2]"
      >
        <source
          src="src/assets/background.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70 z-10" />

      {/* Form */}
      <div className="relative z-20 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-8 py-10 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {errorMsg && (
          <div className="text-red-400 text-sm mb-4 text-center">{errorMsg}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm mb-1 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Login Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
