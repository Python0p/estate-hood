import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiAlertTriangle, FiLoader, FiArrowRight } from 'react-icons/fi';

const BACKEND_API_URL = import.meta.env.VITE_API_URL;

// --- Helper Component for Countdown View ---
const WaitingView: React.FC<{
    email: string;
    onResend: () => Promise<void>;
    onTimeExpired: () => void;
}> = ({ email, onResend, onTimeExpired }) => {
    const [countdown, setCountdown] = useState(300);
    const [isResending, setIsResending] = useState(false);

    // FIX: Timer effect now depends on `countdown` to restart correctly.
    useEffect(() => {
        if (countdown <= 0) {
            onTimeExpired(); // Notify parent that time is up
            return; 
        }

        const timerId = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [countdown, onTimeExpired]);

    const handleResendClick = async () => {
        setIsResending(true);
        try {
            await onResend();
            setCountdown(300); // This reset will trigger the useEffect above
        } finally {
            setIsResending(false);
        }
    };

    const minutes = Math.floor(countdown / 60);
    const seconds = String(countdown % 60).padStart(2, "0");
    const timeExpired = countdown <= 0;

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 h-16 w-16 bg-green-500/10 border-2 border-green-500/30 text-green-400 rounded-full flex items-center justify-center">
                <FiMail size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-white">Check your email</h2>
            <p className="text-white/70 mb-8 max-w-sm">
                We've sent a secure login link to <strong className="text-white font-medium">{email}</strong>. Click the link to sign in.
            </p>

            {!timeExpired ? (
                <div className="text-center">
                    <p className="text-sm text-white/60">The link will expire in:</p>
                    <p className="text-4xl font-mono font-bold text-cyan-400 my-2">
                        {minutes}:{seconds}
                    </p>
                </div>
            ) : (
                <div className="mt-4 text-center">
                    <p className="text-red-400 mb-4 font-semibold flex items-center gap-2">
                        <FiAlertTriangle /> Link expired.
                    </p>
                    <button
                        onClick={handleResendClick}
                        disabled={isResending}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all duration-300 disabled:opacity-60"
                    >
                        {isResending ? <FiLoader className="animate-spin" /> : 'Resend Link'}
                    </button>
                </div>
            )}
             <p className="mt-8 text-sm text-white/50">You can close this tab. The login will complete automatically.</p>
        </div>
    );
};


// --- Main Login Component ---
const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isWaiting, setIsWaiting] = useState(false);
    const [status, setStatus] = useState<{ type: 'idle' | 'submitting' | 'error' | 'verifying', message: string }>({ type: 'idle', message: '' });
    const [isPollingActive, setIsPollingActive] = useState(true); // FIX: New state to control polling
    const sessionNonceRef = useRef<string | null>(null);

    // Effect to handle token from URL (No changes needed here)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            setStatus({ type: 'verifying', message: 'Verifying login link...' });
            fetch(`${BACKEND_API_URL}/api/v1/user/verify-login?token=${token}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                        window.dispatchEvent(new Event('authChange'));
                        navigate("/");
                    } else {
                        setStatus({ type: 'error', message: data.message || "Invalid or expired login link." });
                        navigate('/login', { replace: true });
                    }
                })
                .catch(() => {
                    setStatus({ type: 'error', message: "Something went wrong during verification." });
                    navigate('/login', { replace: true });
                });
        }
    }, [navigate]);
    
    // FIX: Effect for polling now depends on isPollingActive
    useEffect(() => {
        if (!isWaiting || !isPollingActive) return;

        const poller = setInterval(async () => {
            const nonce = sessionNonceRef.current;
            if (!nonce) return;
            try {
                const res = await fetch(`${BACKEND_API_URL}/api/v1/user/verify-login?sessionNonce=${nonce}`);
                const data = await res.json();
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.dispatchEvent(new Event('authChange'));
                    clearInterval(poller);
                    navigate("/");
                }
            } catch { /* Fail silently, poll will retry */ }
        }, 5000);

        return () => clearInterval(poller);
    }, [isWaiting, isPollingActive, navigate]);


    const handleApiLogin = useCallback(async (currentEmail: string) => {
        const sessionNonce = crypto.randomUUID();
        sessionNonceRef.current = sessionNonce;
        localStorage.setItem("loginEmail", currentEmail);
        
        const res = await fetch(`${BACKEND_API_URL}/api/v1/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentEmail, sessionNonce }),
        });
        
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Login request failed");
        }
        return data;
    }, []);

    const handleInitialLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status.type === 'submitting') return;

        setStatus({ type: 'submitting', message: 'Sending link...' });
        setIsPollingActive(true); // Ensure polling is active for the first attempt
        try {
            await handleApiLogin(email);
            setIsWaiting(true);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        }
    };
    
    const handleResend = useCallback(async () => {
        const savedEmail = localStorage.getItem("loginEmail");
        if (!savedEmail) {
            throw new Error("Could not find email to resend.");
        }
        await handleApiLogin(savedEmail);
        setIsPollingActive(true); // FIX: Re-enable polling on resend
        alert("A new login link has been sent to your email.");
    }, [handleApiLogin]);

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-900">
            <div className="absolute inset-0 w-full h-full z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <video autoPlay loop muted playsInline className="w-full h-full object-cover brightness-50">
                    <source src="https://res.cloudinary.com/dnfqbyhxr/video/upload/v1752704263/shekvetili-georgia-2020-aerial-front-view-of-paragraph-resort-spa-hotel-exterior-at-night-free-video_1_mglffg.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="relative z-20 w-full max-w-md bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8 text-white transition-all duration-500">
                {isWaiting ? (
                    <WaitingView 
                        email={localStorage.getItem("loginEmail") || email} 
                        onResend={handleResend}
                        onTimeExpired={() => setIsPollingActive(false)} // FIX: Pass callback to stop polling
                    />
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-center mb-2">Welcome Back</h2>
                        <p className="text-center text-white/60 mb-8">Enter your email to receive a login link.</p>

                        {status.type === 'error' && (
                            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center gap-3">
                                <FiAlertTriangle /> {status.message}
                            </div>
                        )}
                        {status.type === 'verifying' && (
                            <div className="bg-blue-500/10 text-blue-300 text-sm p-3 rounded-lg mb-6 flex items-center gap-3">
                                <FiLoader className="animate-spin" /> {status.message}
                            </div>
                        )}

                        <form onSubmit={handleInitialLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-white/70 mb-2 block">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 flex items-center justify-center gap-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all duration-300 disabled:opacity-60 transform hover:scale-105"
                                disabled={status.type === 'submitting'}
                            >
                                {status.type === 'submitting' ? <FiLoader className="animate-spin" /> : 'Send Login Link'}
                                {status.type !== 'submitting' && <FiArrowRight/>}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-white/60">
                            Don't have an account?{" "}
                            <a onClick={() => navigate('/register')} className="text-cyan-400 hover:underline cursor-pointer">
                                Sign Up
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;