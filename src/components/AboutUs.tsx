import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section
      id="about"
      className="relative py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-10 shadow-xl">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight text-white drop-shadow">
            About Us
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Estate Hood is a full-service real estate solutions company, specialising in comprehensive property management and transaction advisory services.

We manage both residential and commercial assets, offering end-to-end solutions including tenant acquisition, property leasing, asset maintenance, and operational oversight — ensuring seamless ownership experiences for property owners and investors.

In addition to management services, we provide expert assistance in primary sales, resale transactions, and investment advisory across a diverse portfolio of real estate assets. Our team leverages in-depth market insights to identify high-return opportunities and facilitate smooth, transparent transactions for our clients.

With a growing presence in India’s prime markets and select international destinations, we are committed to delivering strategic, reliable, and value-driven real estate solutions tailored to modern investor needs.

Your property. Our priority.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
