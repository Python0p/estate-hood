import React from 'react';

const ContactForm: React.FC = () => {
  return (
    <section
      id="contact"
      className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <h2 className="text-4xl font-extrabold text-center mb-10 tracking-tight">
        Get in Touch
      </h2>

      <form
        className="max-w-xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl space-y-6"
      >
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <textarea
          placeholder="Your Message"
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
