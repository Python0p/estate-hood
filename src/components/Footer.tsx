import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#172236] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Company Info */}
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-1">Estate Hood</h3>
          <p className="text-sm text-white/80">
            Your trusted partner for residential and commercial properties in India.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold mb-1">Quick Links</span>
          <ul className="flex gap-4 text-sm">
            <li>
              <a href="#services" className="hover:underline text-blue-200">Services</a>
            </li>
            <li>
              <a href="#about" className="hover:underline text-blue-200">About Us</a>
            </li>
            <li>
              <a href="#contact" className="hover:underline text-blue-200">Contact</a>
            </li>
            <li>
              <a href="#get-started" className="hover:underline text-blue-200">Get Started</a>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm">
            <span className="font-semibold">Email:</span>{' '}
            <a href="mailto:info@estatehoods.com" className="text-blue-200 hover:underline">
              info@estatehoods.com
            </a>
          </div>
          <div className="flex gap-3 mt-1">
            <a href="https://www.facebook.com/share/171ECfWgk5/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#1877F3"/><path d="M15.5 8.5h-2a.5.5 0 0 0-.5.5v2h2.5l-.5 2H13v5h-2v-5H9v-2h2v-1.5A2.5 2.5 0 0 1 13.5 6h2v2.5z" fill="#fff"/></svg>
            </a>
            <a href="https://www.instagram.com/estatehoods" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#E1306C"/><path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 7.8A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm4.95-8.1a1.12 1.12 0 1 1-1.12-1.12 1.12 1.12 0 0 1 1.12 1.12z" fill="#fff"/></svg>
            </a>
            <a href="https://youtube.com/@estatehood?si=qBN8ZRU_nQm5ZuCf" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-400">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 15.5l6-3.5-6-3.5v7z" fill="#fff"/></svg>
            </a>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="mt-6 text-center text-xs text-white/60">
        &copy; {new Date().getFullYear()} Estate Hood. All rights reserved. | Designed with passion for your real estate journey.
      </div>
    </footer>
  );
};

export default Footer;
