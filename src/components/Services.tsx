import React from 'react';

type Service = {
  title: string;
  desc: string;
};

const services: Service[] = [
  {
    title: 'Residential Properties',
    desc: 'Apartments, Villas, and Homes in top locations.',
  },
  {
    title: 'Commercial Spaces',
    desc: 'Office spaces, showrooms, and more.',
  },
  {
    title: 'Legal Assistance',
    desc: 'Expert help with documentation and transactions.',
  },
];

const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="relative py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-12 tracking-tight">
          Our Services
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold mb-2 text-white drop-shadow">
                {service.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
