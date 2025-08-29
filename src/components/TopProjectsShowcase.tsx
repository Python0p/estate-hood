import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LocationIcon from '../components/react-bits-style/LocationIcon';
import CheckIcon from '../components/react-bits-style/CheckIcon';

const BACKEND_API_URL = import.meta.env.VITE_API_URL;

const PreLaunch_images = [
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752704851/image0_otfvry.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752704844/image1_eqoph2.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752704844/image4_vjlfbv.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752704844/image2_ag87ir.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752704844/image3_fboyiq.png",
]

const Technopark_images = [
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705596/image_i1uqsa.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705323/image0_ryrucz.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705322/image3_c1bgpm.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705322/image2_ah2tgr.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705322/image1_ynopvw.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705321/image4_albf0i.png",
  "https://res.cloudinary.com/dnfqbyhxr/image/upload/v1752705320/image5_bhnhp1.png",
]

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
    images: Array(5).fill('').map((_, i) => PreLaunch_images[i]),
    tags: ['Commercial', 'New Launch']
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
    images: Array(7).fill('').map((_, i) => Technopark_images[i]),
    tags: ['Commercial', 'Lease']
  }
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleViewDetails = async () => {
    setIsLoading(true);

    try {
      const payload = {
        keyword: project.title, // Search by project title
      };

      const res = await fetch(`${BACKEND_API_URL}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      navigate('/results', { state: { properties: data, projectTitle: project.title } });
    } catch (err) {
      console.error("Failed to fetch project details:", err);
      navigate('/results', { state: { properties: [project], projectTitle: project.title } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loading Overlay for this card */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

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
            <button 
              className="px-4 py-2 bg-white text-gray-900 rounded-full font-medium shadow-md hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleViewDetails}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'View Details'
              )}
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
          
          <button className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={() => window.open("https://wa.me/919871114903", '_blank')}
          >
            Connect with Advisor
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

const TopProjectsShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleBrowseAllProjects = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_API_URL}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const data = await res.json();
      navigate('/results', { state: { properties: data } });
    } catch (err) {
      console.error("Failed to fetch all properties:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 bg-gray-50 relative">
      {/* Fullscreen Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

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
          <button
            onClick={handleBrowseAllProjects}
            disabled={isLoading}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 underline disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Browse all projects →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopProjectsShowcase;
