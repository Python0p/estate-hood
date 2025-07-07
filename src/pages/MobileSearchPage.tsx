// src/pages/MobileSearchPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox'; // Your full form
import { IoArrowBack } from 'react-icons/io5';

const MobileSearchPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#172236] text-white p-4 relative">
      {/* Back Button */}
      <button
        className="absolute top-4 left-4 text-white bg-white/10 p-2 rounded-full backdrop-blur hover:bg-white/20"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack size={24} />
      </button>

      <h2 className="text-xl font-bold text-center my-6">Search Properties</h2>

      <div className="mt-12">
        <SearchBox />
      </div>
    </div>
  );
};

export default MobileSearchPage;
