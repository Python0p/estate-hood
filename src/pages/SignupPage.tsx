import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_API_URL = import.meta.env.VITE_API_URL;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [isWaiting, setIsWaiting] = useState(false);
  const [verifiedWithoutToken, setVerifiedWithoutToken] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // <--- New state

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true); // Disable button immediately

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const emailVal = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phoneno = (form.elements.namedItem("phone") as HTMLInputElement).value;

    const sessionNonce = crypto.randomUUID();

    localStorage.setItem("sessionNonce", sessionNonce);
    localStorage.setItem("name", name);
    localStorage.setItem("email", emailVal);
    localStorage.setItem("phoneno", phoneno);

    try {
      const res = await fetch(`${BACKEND_API_URL}/api/v1/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: emailVal, phoneno, sessionNonce }),
      });

      const data = await res.json();

      if (res.ok) {
        setEmail(emailVal);
        setIsWaiting(true);
        setCountdown(300);
        setTimeExpired(false);
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false); // Re-enable button only if signup failed
    }
  };

  const handleResendVerification = async () => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const phoneno = localStorage.getItem("phoneno");
    const sessionNonce = localStorage.getItem("sessionNonce");

    if (!name || !email || !phoneno || !sessionNonce) {
      alert("Missing signup data. Please try again.");
      return;
    }

    setResending(true);
    try {
      const res = await fetch(`${BACKEND_API_URL}/api/v1/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phoneno, sessionNonce }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Verification link resent!");
        setCountdown(300);
        setTimeExpired(false);
        setVerifiedWithoutToken(false);
        setIsWaiting(false);
        setTimeout(() => setIsWaiting(true), 50);
      } else {
        alert(data.message || "Could not resend link.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (!isWaiting) return;

    const sessionNonce = localStorage.getItem("sessionNonce");

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

    const poller = setInterval(async () => {
      try {
        const res = await fetch(
          `${BACKEND_API_URL}/api/v1/user/check-verification?sessionNonce=${sessionNonce}`
        );
        const data = await res.json();

        if (data.verified) {
          if (data.token) {
            localStorage.setItem("token", data.token);
            clearInterval(timer);
            clearInterval(poller);
            navigate("/");
          } else {
            setVerifiedWithoutToken(true);
            clearInterval(timer);
            clearInterval(poller);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(poller);
    };
  }, [isWaiting, navigate]);

  if (isWaiting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">Check your email</h2>
        <p className="text-white/80 mb-6">
          We've sent a verification link to <strong>{email}</strong>.
        </p>

        <p className="text-lg font-semibold text-yellow-300 mb-2">
          Time Remaining:{" "}
          {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
        </p>

        {countdown === 0 && (
          <p className="text-red-400 font-semibold mt-4">
            ⏱️ Time's up! You can resend the link below.
          </p>
        )}

        {verifiedWithoutToken && (
          <p className="text-blue-400 font-semibold mt-6">
            ✅ Your email has been verified, but it looks like you used a different
            device. Please log in from this device to continue.
          </p>
        )}

        {timeExpired && (
          <div className="mt-6">
            <p className="text-red-400 mb-2 font-semibold">
              ⌛ Verification link expired. Resend below.
            </p>
            <button
              onClick={handleResendVerification}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={resending}
            >
              {resending ? "Resending..." : "Resend Verification Email"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-screen flex items-center justify-center px-4">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.5] saturate-[1.2]"
      >
        <source
          src="/background.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70 z-10" />

      {/* Signup Form */}
      <div className="relative z-20 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-8 py-10">
        <h2 className="text-white text-3xl font-bold text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="text-white text-sm block mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white"
            />
          </div>
          <div>
            <label className="text-white text-sm block mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+91 9876543210"
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/70">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
