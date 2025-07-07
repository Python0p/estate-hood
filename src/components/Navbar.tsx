import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

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
          <motion.div onClick={()=>navigate('/') }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* Hanging Logo */}
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full h-4 w-0.5 bg-white/40 z-40" />
              <motion.div
                initial={{ y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative z-50 -mb-8"
              >
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-[5px] border-white shadow-2xl bg-white relative">
                  <img
                    src={logo}
                    alt="Estate Hood Logo"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 blur-2xl opacity-20 z-[-1]" />
                </div>
              </motion.div>
            </div>

            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight drop-shadow">
              Estate Hood
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map(({ label, href }, index) => (
              <motion.li
                key={label}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.4,
                  ease: 'easeOut'
                }}
              >
                <a
                  href={href}
                  className="relative px-4 py-2 text-white/90 hover:text-white transition-colors duration-200 font-medium text-sm focus:outline-none"
                >
                  <span className="relative z-10">{label}</span>
                  <motion.span
                    className="absolute left-4 right-4 bottom-1 h-0.5 bg-blue-400 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  />
                </a>
              </motion.li>
            ))}

            <motion.li
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.5,
                type: 'spring',
                stiffness: 300,
                damping: 15
              }}
              className="ml-4"
            >
              <a
                href="/contact"
                className="relative px-6 py-2.5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold shadow-lg transition-all duration-300 overflow-hidden focus:outline-none"
              >
                <span className="relative z-10">Contact US</span>
                <motion.span
                  className="absolute inset-0 bg-blue-700/40 opacity-0 z-0"
                  initial={{ x: -100 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </a>
            </motion.li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white/10 backdrop-blur-lg rounded-xl mt-2 px-4 py-4 shadow-lg"
            >
              <ul className="flex flex-col gap-3">
                {navItems.map(({ label, href }) => (
                  <motion.li
                    key={label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <a
                      href={href}
                      className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="mt-2"
                >
                  <a
                    href="/contact"
                    className="block px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full shadow hover:shadow-md transition-all focus:outline-none"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Us
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
