import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Project = {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
};

const projects: Project[] = [
  {
    title: 'BHUTANI ASTRATHUM ',
    subtitle: 'Noida Extension, Milak Lachchhi, Greater Noida, Milak Lachhi, Uttar Pradesh 201009',
    description:
      'Bhutani Astrathum Gr. Noida West In collaboration with Yashoda Group',
    images: [
      'src/assets/PreLaunch/image.png',
      'src/assets/PreLaunch/image0.png',
      'src/assets/PreLaunch/image1.png',
      'src/assets/PreLaunch/image2.png',
      'src/assets/PreLaunch/image3.png',
    ],
  },
  {
    title: 'Techno Park',
    subtitle: 'Sector 127, Noida, Uttar Pradesh 201313',
    description:
      `Prelease office
          Tower D 
          -10990+ 899
          -3 years lease lock-in
          -Lease 8% on BSP for 3 years 
          (100% lease starting after pay 50% BSP)
          -Balance payment after 6 months`,

    images: [
      'src/assets/Technopark/image0.png',
      'src/assets/Technopark/image1.png',
      'src/assets/Technopark/image2.png',
      'src/assets/Technopark/image3.png',
      'src/assets/Technopark/image4.png',
      'src/assets/Technopark/image5.png',
    ],
  },
];

const TopProjectsShowcase: React.FC = () => {
  const [activeImageIndex, setActiveImageIndex] = useState<number[]>([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prevIndices) =>
        prevIndices.map((currentIndex, projectIdx) => {
          const nextIndex = (currentIndex + 1) % projects[projectIdx].images.length;
          return nextIndex;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (projectIdx: number, imageIdx: number) => {
    const newIndices = [...activeImageIndex];
    newIndices[projectIdx] = imageIdx;
    setActiveImageIndex(newIndices);
  };

  return (
    <section className="py-12 px-2 bg-[#f7f9fb]">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Top Client Projects</h2>
        <p className="text-gray-600 mt-2 text-base">
          A glimpse into our most premium residential and commercial listings
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {projects.map((project, projectIdx) => (
          <div
            key={project.title}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-xs mx-auto"
          >
            {/* Image Section */}
            <div className="relative h-[20rem] overflow-hidden">
              <motion.img
                key={project.images[activeImageIndex[projectIdx]]}
                src={project.images[activeImageIndex[projectIdx]]}
                alt={project.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {project.images.map((img, imgIdx) => (
                  <button
                    key={imgIdx}
                    onClick={() => handleImageChange(projectIdx, imgIdx)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeImageIndex[projectIdx] === imgIdx
                        ? 'bg-blue-600'
                        : 'bg-white border border-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Text Content */}
            <div className="p-4 text-left">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {project.title}
              </h3>
              <h4 className="text-sm text-blue-600 font-medium mb-2">
                {project.subtitle}
              </h4>
              <p className="text-gray-600 text-sm">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopProjectsShowcase;
