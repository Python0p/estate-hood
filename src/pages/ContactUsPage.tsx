import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaClock, FaQuestionCircle } from 'react-icons/fa';

const faqs = [
  {
    question: "How soon will you respond to my query?",
    answer: "We typically respond within 24 hours on business days. For urgent matters, use WhatsApp or call us directly."
  },
  {
    question: "Can I schedule a property visit online?",
    answer: "Yes! Use the contact form or WhatsApp to request a visit. Our team will coordinate with you for a suitable time."
  },
  {
    question: "Where are your offices located?",
    answer: "Our main office is in Noida, but we operate across India. Check the map or contact us for more details."
  }
];

const ContactUsPage: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Sidebar: Contact Info + Client Photo + Bio */}
        <div className="flex flex-col gap-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-white/80 text-sm">
              <li>
                📧 <strong>Email:</strong> <a href="mailto:info@estatehoods.com" className="text-blue-400">info@estatehoods.com</a>
              </li>
              <li>
                📍 <strong>Address:</strong><br />
                A-514A, Alphathum, Sector-90,<br />
                Noida, GBN, Uttar Pradesh 201305
              </li>
              <li>
                ☎️ <strong>Phone:</strong> <a href="tel:+919871114903" className="text-blue-400">+91-9871114903</a>
              </li>
              <li>
                <FaWhatsapp className="inline mr-1 text-green-400" /> <strong>WhatsApp:</strong> <a href="https://wa.me/919871114903" className="text-green-300">Chat Now</a>
              </li>
              <li>
                <FaClock className="inline mr-1 text-yellow-300" /> <strong>Office Hours:</strong> Mon-Sat, 10am - 7pm
              </li>
            </ul>
          </div>
          {/* Client Photo & Bio */}
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
            <img
              src="/assets/client-photo.jpg"
              alt="Client"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg mb-3"
            />
            <h4 className="text-lg font-bold text-white mb-1">Kamna Mahto</h4>
            <div className="text-white/80 text-center text-sm">
              <span>
                <strong>About the Founder</strong>
              </span>
              <p className="text-justify">
                Miss Kamna Mahto, founder of Estatehood, brings over a decade of real estate expertise rooted in deep market understanding and unwavering client trust. Over the years, she has cultivated long-standing relationships with hundreds of clients — both within India and across the globe — who continue to rely on her for strategic guidance and responsible property management.

                Her approach goes beyond transactional advice. She assists clients in managing their properties remotely, offering end-to-end support that includes investment planning, tenant coordination, resale structuring, and market positioning. Her commitment is not just to deliver convenience — but to ensure that each decision aligns with long-term financial sensibility and real estate fundamentals.

                Kamna’s core philosophy is simple yet rare: to lead with integrity in a space flooded with noise. She believes that not every trending project promises real growth — and stands firm on advising only those investments that are backed by potential, not by hype. Her sharp judgment, grounded in research and real-world performance, helps clients avoid emotional or market-driven traps and instead focus on assets that appreciate with time, purpose, and strategy.

                At Estatehood, she continues to be the voice of clarity — offering calm, considered advice in a chaotic market, and ensuring that every step you take in real estate is built on insight, not impulse.
              </p>
            </div>
          </div>
          {/* Socials */}
          <div className="flex gap-4 justify-center mt-2">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 transition">
              <FaInstagram size={20} />
            </a>
            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition">
              <FaYoutube size={20} />
            </a>
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition">
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>

        {/* Large Map */}
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 h-[420px] md:h-[500px] w-full">
            <iframe
              title="Estate Hood Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1782.6199498094807!2d77.408513!3d28.5127971!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce9fcbe0273a1%3A0xd8ed754838e2f8a4!2sBhutani%20Alphathum!5e1!3m2!1sen!2sin!4v1751882045055!5m2!1sen!2sin"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              className="border-0 w-full h-full min-h-[420px] md:min-h-[500px]"
            ></iframe>
          </div>
          {/* Contact Form & FAQ side by side on large screens */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <form
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl space-y-6"
            >
              <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
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
              <input
                type="tel"
                placeholder="Your Phone"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              <div className="text-xs text-white/60 text-center pt-2">
                By submitting, you agree to our <a href="/privacy" className="underline text-blue-300">Privacy Policy</a>.
              </div>
            </form>
            {/* FAQ / Help Section */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl space-y-5">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaQuestionCircle className="text-blue-400" /> Need Help?
              </h3>
              <ul className="space-y-4">
                {faqs.map((faq, idx) => (
                  <li key={idx}>
                    <div className="font-medium text-white mb-1">{faq.question}</div>
                    <div className="text-white/70 text-sm">{faq.answer}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs text-white/60">
                Didn’t find your answer? <a href="#get-started" className="text-blue-300 underline">Contact our team</a> for personalized support.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
