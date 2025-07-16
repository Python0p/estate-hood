import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

interface Property {
  _id: string;
  title: string;
  type: string;
  city: string;
  category: string;
  images: string[];
  price: { basePrice: number; unit: string };
  highlights?: string[];
  locality?: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const properties: Property[] = location.state?.properties || [];

  if (!properties.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-white px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3">No properties found</h2>
          <p className="text-gray-400 mb-6">
            Try adjusting your search filters or explore other areas
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {properties.length} Properties Found
          </h1>
          <p className="text-gray-400">
            Matching your search criteria
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/property/${property._id}`)}
            >
              {/* Image with hover effect */}
              <div className="relative h-60 overflow-hidden">
                <img
                  src={property.images?.[0] || "/no-image.jpg"}
                  alt={property.title}
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                />
                {/* Price badge */}
                <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ₹{property.price.basePrice.toLocaleString()}
                  <span className="text-xs opacity-80 ml-1">/{property.price.unit}</span>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <FiMapPin className="mr-1" size={14} />
                  <span>{property.locality || property.city}</span>
                </div>

                {/* Highlights ticker */}
                {property.highlights && property.highlights.length > 0 && (
                  <div className="mb-4 overflow-hidden">
                    <div className="flex gap-2 animate-marquee whitespace-nowrap">
                      {property.highlights.map((highlight, i) => (
                        <span key={i} className="text-xs bg-blue-900/30 text-blue-200 px-3 py-1 rounded-full">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta info */}
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <span className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full">
                      {property.type}
                    </span>
                    <span className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full">
                      {property.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${property._id}`);
                    }}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
                  >
                    View <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination would go here */}
        <div className="mt-12 flex justify-center">
          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;