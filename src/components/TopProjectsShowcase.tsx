import React, { useState, useEffect } from 'react';
import { motion, type PanInfo, type useAnimation } from 'framer-motion';
import LocationIcon from '../components/react-bits-style/LocationIcon';
import CheckIcon from '../components/react-bits-style/CheckIcon';

type Project = {
  id: string;
  title: string;
  location: string;
  highlights: string[];
  images: string[];
  tags: string[];
};

const projects: Project[] = [
  {
    id: '1',
    title: 'BHUTANI ASTRATHUM',
    location: 'Noida Extension',
    highlights: [
      'Collaboration with Yashoda Group',
      'Premium residential towers',
      'Strategic location'
    ],
    images: Array(5).fill('').map((_, i) => `src/assets/PreLaunch/image${i}.png`),
    tags: ['Residential', 'New Launch']
  },
  {
    id: '2',
    title: 'Techno Park',
    location: 'Sector 127, Noida',
    highlights: [
      'Prelease office space',
      '10,990+ sq.ft available',
      '3 years lease lock-in'
    ],
    images: Array(6).fill('').map((_, i) => `src/assets/Technopark/image${i}.png`),
    tags: ['Commercial', 'Lease']
  }
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-rotate images
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      setActiveImage(prev => (prev + 1) % project.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRotate, project.images.length]);

  const handleImageChange = (index: number) => {
    setActiveImage(index);
    setAutoRotate(false);
    setTimeout(() => setAutoRotate(true), 10000); // Resume auto-rotate after 10s
  };

  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with dull effect on hover */}
      <div className="aspect-[4/3] relative">
        <div className={`relative w-full h-full transition-all duration-300 ${isHovered ? 'brightness-75' : 'brightness-100'}`}>
          <img 
            src={project.images[activeImage]} 
            alt={project.title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </div>
        
        {/* Hover buttons */}
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <button className="px-4 py-2 bg-white text-gray-900 rounded-full font-medium shadow-md hover:bg-gray-100 transition-colors">
              View Details
            </button>
          </motion.div>
        )}

        {/* Image indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
          {project.images.map((_, idx) => (
            <button 
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                handleImageChange(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-white w-4' : 'bg-white bg-opacity-50 hover:bg-opacity-70'}`}
            />
          ))}
        </div>

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Details that appear on hover */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isHovered ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="p-4">
          <h3 className="font-bold text-lg">{project.title}</h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <LocationIcon className="w-4 h-4 mr-1" />
            {project.location}
          </p>
          
          <ul className="mt-3 space-y-1">
            {project.highlights.map((item, i) => (
              <li key={i} className="text-sm flex items-start">
                <CheckIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          
          <button className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Contact Agent
          </button>
        </div>
      </motion.div>

      {/* Always visible minimal info */}
      <div className="p-4">
        <h3 className="font-bold">{project.title}</h3>
        <p className="text-sm text-gray-500 truncate">{project.location}</p>
      </div>
    </motion.div>
  );
};

// ... (LocationIcon and CheckIcon components remain the same)

const TopProjectsShowcase: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
          <p className="text-gray-500 mt-2">Premium properties handpicked for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="text-sm font-medium text-gray-700 hover:text-gray-900 underline">
            Browse all projects →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopProjectsShowcase;