import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // This effect correctly checks for the token and listens for changes.
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        checkAuthStatus(); // Initial check

        // Listen for custom event from login/logout actions to update UI instantly
        window.addEventListener('authChange', checkAuthStatus);
        
        // Listen to the standard storage event for cross-tab sync
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('authChange', checkAuthStatus);
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        // Dispatch event so all parts of the app know about the logout
        window.dispatchEvent(new Event('authChange')); 
        navigate('/');
    };

    // "Contact" is now a regular nav item for a cleaner button layout
    const navItems = [
        { label: 'Services', href: '#services' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '/contact' }
    ];

    const handleLinkClick = (href: string) => {
        setMobileMenuOpen(false);
        // For internal links, use navigate. For anchor links, use standard href.
        if (href.startsWith('/')) {
            navigate(href);
        } else {
            window.location.href = href;
        }
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed w-full z-50 backdrop-blur-lg bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-slate-900/70 border-b border-white/10 shadow-[0_2px_20px_rgba(255,255,255,0.05)]"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center py-3">
                    {/* Logo and Brand */}
                    <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full h-4 w-0.5 bg-white/40 z-40" />
                            <motion.div initial={{ y: 0 }} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }} className="relative z-50 -mb-8">
                                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-[5px] border-white shadow-2xl bg-white relative">
                                    <img src="https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705701/logo_ifw3ty.jpg" alt="Estate Hood Logo" className="h-full w-full object-cover" />
                                </div>
                            </motion.div>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight drop-shadow">Estate Hood</span>
                    </div>

                    {/* --- Desktop Navigation --- */}
                    <ul className="hidden md:flex items-center gap-2">
                        {navItems.map(({ label, href }) => (
                            <motion.li key={label} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + (navItems.findIndex(item => item.label === label) * 0.1), duration: 0.4, ease: 'easeOut' }}>
                                <button onClick={() => handleLinkClick(href)} className="relative px-4 py-2 text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm">
                                    <span className="relative z-10">{label}</span>
                                    <motion.span className="absolute left-4 right-4 bottom-1 h-0.5 bg-blue-400 rounded-full" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }} style={{ originX: 0 }} />
                                </button>
                            </motion.li>
                        ))}

                        {isLoggedIn ? (
                             <>
                                <motion.li initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }} className="ml-4">
                                    <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300" aria-label="Dashboard">
                                        <FiUser size={20} />
                                    </button>
                                </motion.li>
                                <motion.li initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }} className="ml-2">
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-semibold shadow-lg hover:shadow-red-500/30 transition-all duration-300">
                                        <FiLogOut />
                                        <span>Logout</span>
                                    </button>
                                </motion.li>
                            </>
                        ) : (
                            <>
                                <motion.li initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }} className="ml-4">
                                     <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold transition-all duration-300">
                                        <FiLogIn />
                                        <span>Login</span>
                                    </button>
                                </motion.li>
                                <motion.li initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }} className="ml-2">
                                    <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                                        <FiUserPlus />
                                        <span>Register</span>
                                    </button>
                                </motion.li>
                            </>
                        )}
                    </ul>

                    {/* --- Mobile Menu Button --- */}
                    <button className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                </div>

                {/* --- Mobile Menu --- */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="md:hidden overflow-hidden">
                            <div className="bg-slate-800/80 backdrop-blur-lg rounded-xl my-2 px-4 py-4 shadow-lg border border-white/10">
                                <ul className="flex flex-col gap-3">
                                    {navItems.map(({ label, href }) => (
                                        <li key={label}><button onClick={() => handleLinkClick(href)} className="w-full text-left block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors">{label}</button></li>
                                    ))}
                                    
                                    <li className="border-t border-white/10 mt-2 pt-4">
                                        {isLoggedIn ? (
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="flex-1 block px-4 py-3 text-center bg-white/10 text-white font-medium rounded-lg">Dashboard</button>
                                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex-1 block px-4 py-3 text-center bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow">Logout</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="flex-1 block px-4 py-3 text-center bg-white/10 text-white font-medium rounded-lg">Login</button>
                                                <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="flex-1 block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow">Register</button>
                                            </div>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;