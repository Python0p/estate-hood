import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/',
    icon: <FaFacebookF size={18} className="text-white" />,
    bg: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/estatehoods',
    icon: <FaInstagram size={18} className="text-white" />,
    bg: 'bg-gradient-to-tr from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/',
    icon: <FaYoutube size={18} className="text-white" />,
    bg: 'bg-red-600 hover:bg-red-700',
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/919871114903',
    icon: <FaWhatsapp size={18} className="text-white" />,
    bg: 'bg-green-500 hover:bg-green-600',
  },
];

const Header: React.FC = () => (
  <header
    className="relative w-full flex items-center justify-between px-6 py-2 z-[999] backdrop-blur-md bg-gradient-to-b from-slate-900/80 to-slate-800/60 border-b border-white/10 shadow-lg"
  >
    {/* Left-Side Branding */}
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 shadow-sm backdrop-blur-sm"
    >
      <span className="text-sm font-bold text-white drop-shadow">Estate Hood</span>
      <span className="text-xs text-blue-100 font-medium hidden sm:inline">Your Estate, Your Hood</span>
    </motion.div>

    {/* Social Media Icons */}
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
      className="flex gap-2"
    >
      {socialLinks.map((link, idx) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className={`p-2 rounded-full ${link.bg} transition duration-300 shadow-lg`}
          whileHover={{ scale: 1.15, rotate: [0, 6, -6, 0] }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + idx * 0.15, type: 'spring', stiffness: 250 }}
        >
          {link.icon}
        </motion.a>
      ))}
    </motion.div>
  </header>
);

export default Header;
