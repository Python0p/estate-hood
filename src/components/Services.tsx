import React from 'react';
import { FaHome, FaBuilding, FaHandshake } from 'react-icons/fa'; // Changed FaGavel to FaHandshake
import { motion, type Variants } from 'framer-motion';

type Service = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    title: 'Residential Properties',
    desc: 'Apartments, Villas, and Homes in top locations.',
    icon: <FaHome className="text-blue-400 text-4xl mb-4 drop-shadow-lg" />,
  },
  {
    title: 'Commercial Spaces',
    desc: 'Office spaces, showrooms, and more.',
    icon: <FaBuilding className="text-violet-400 text-4xl mb-4 drop-shadow-lg" />,
  },
  {
    title: 'Top Resale Picks',
    desc: 'We have the top picks for resale properties.',
    // Updated icon to FaHandshake
    icon: <FaHandshake className="text-amber-400 text-4xl mb-4 drop-shadow-lg" />,
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.2 + custom * 0.18,
      duration: 0.7,
      type: 'spring',
      stiffness: 120,
    },
  }),
};

const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="relative py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-extrabold mb-12 tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          viewport={{ once: true }}
        >
          Our Services
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.04] flex flex-col items-center"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
            >
              {service.icon}
              <h3 className="text-xl font-semibold mb-2 text-white drop-shadow">
                {service.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;