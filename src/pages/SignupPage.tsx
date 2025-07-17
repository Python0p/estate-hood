import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLoader, FiArrowRight, FiAlertTriangle } from 'react-icons/fi';

const BACKEND_API_URL = import.meta.env.VITE_API_URL;

// --- Helper Component for Countdown View ---
const WaitingView: React.FC<{
    email: string;
    onResend: () => Promise<void>;
    onTimeExpired: () => void;
}> = ({ email, onResend, onTimeExpired }) => {
    const [countdown, setCountdown] = useState(300);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (countdown <= 0) {
            onTimeExpired();
            return;
        }
        const timerId = setInterval(() => setCountdown(prev => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [countdown, onTimeExpired]);

    const handleResendClick = async () => {
        setIsResending(true);
        try {
            await onResend();
            setCountdown(300);
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
                We've sent a verification link to <strong className="text-white font-medium">{email}</strong>.
            </p>
            {!timeExpired ? (
                <div>
                    <p className="text-sm text-white/60">The link will expire in:</p>
                    <p className="text-4xl font-mono font-bold text-cyan-400 my-2">{minutes}:{seconds}</p>
                </div>
            ) : (
                <div className="mt-4 text-center">
                    <p className="text-red-400 mb-4 font-semibold flex items-center gap-2">
                        <FiAlertTriangle /> Verification link expired.
                    </p>
                    <button
                        onClick={handleResendClick}
                        disabled={isResending}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all duration-300 disabled:opacity-60"
                    >
                        {isResending ? <FiLoader className="animate-spin" /> : 'Resend Verification'}
                    </button>
                </div>
            )}
        </div>
    );
};

// --- Main Signup Component ---
const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [isWaiting, setIsWaiting] = useState(false);
    const [isPollingActive, setIsPollingActive] = useState(true);
    const [status, setStatus] = useState<{ type: 'idle' | 'submitting' | 'error', message: string }>({ type: 'idle', message: '' });
    const signupDataRef = useRef<{ name: string, email: string, phoneno: string, sessionNonce: string } | null>(null);

    // Polling effect to check for verification
    useEffect(() => {
        if (!isWaiting || !isPollingActive) return;

        const poller = setInterval(async () => {
            const nonce = signupDataRef.current?.sessionNonce;
            if (!nonce) return;
            try {
                const res = await fetch(`${BACKEND_API_URL}/api/v1/user/check-verification?sessionNonce=${nonce}`);
                const data = await res.json();
                if (data.verified) {
                    localStorage.setItem("token", data.token);
                    window.dispatchEvent(new Event('authChange'));
                    clearInterval(poller);
                    navigate("/");
                }
            } catch { /* Fail silently */ }
        }, 5000);

        return () => clearInterval(poller);
    }, [isWaiting, isPollingActive, navigate]);

    const handleApiSignup = useCallback(async (signupDetails: { name: string, email: string, phoneno: string, sessionNonce: string }) => {
        const res = await fetch(`${BACKEND_API_URL}/api/v1/user/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupDetails),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Signup request failed");
        }
        return data;
    }, []);

    const handleInitialSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status.type === 'submitting') return;

        setStatus({ type: 'submitting', message: 'Registering...' });
        setIsPollingActive(true);

        const formData = new FormData(e.currentTarget);
        const signupDetails = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phoneno: formData.get("phoneno") as string,
            sessionNonce: crypto.randomUUID()
        };
        signupDataRef.current = signupDetails;

        try {
            await handleApiSignup(signupDetails);
            setIsWaiting(true);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        }
    };
    
    const handleResend = useCallback(async () => {
        if (!signupDataRef.current) {
            throw new Error("Could not find your details to resend.");
        }
        await handleApiSignup(signupDataRef.current);
        setIsPollingActive(true);
        alert("A new verification link has been sent.");
    }, [handleApiSignup]);

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
                        email={signupDataRef.current?.email || ''} 
                        onResend={handleResend}
                        onTimeExpired={() => setIsPollingActive(false)}
                    />
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-center mb-2">Create Account</h2>
                        <p className="text-center text-white/60 mb-8">Join us and find your perfect property.</p>

                        {status.type === 'error' && (
                            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center gap-3">
                                <FiAlertTriangle /> {status.message}
                            </div>
                        )}

                        <form onSubmit={handleInitialSignup} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium text-white/70 mb-2 block">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                    <input id="name" name="name" type="text" required placeholder="Your Name" className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-white/70 mb-2 block">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                    <input id="email" name="email" type="email" required placeholder="you@example.com" className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="phoneno" className="text-sm font-medium text-white/70 mb-2 block">Phone Number</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                                    <input id="phoneno" name="phoneno" type="tel" required placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 flex items-center justify-center gap-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-all duration-300 disabled:opacity-60 transform hover:scale-105"
                                disabled={status.type === 'submitting'}
                            >
                                {status.type === 'submitting' ? <FiLoader className="animate-spin" /> : 'Create Account'}
                                {status.type !== 'submitting' && <FiArrowRight/>}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-white/60">
                            Already have an account?{" "}
                            <span onClick={() => navigate('/login')} className="text-cyan-400 hover:underline cursor-pointer">
                                Login
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignupPage;