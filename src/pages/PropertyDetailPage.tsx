import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import { 
  FiMapPin, 
  FiHome, 
  FiLayers, 
  FiCalendar, 
  FiDollarSign, 
  FiMail, 
  FiPhone, 
  FiUser,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

type Property = {
  title: string;
  address: string;
  type: string;
  city: string;
  category: string;
  locality: string;
  landArea: string;
  possession: string;
  price?: {
    basePrice?: number;
    unit?: string;
    otherCharges?: number;
    description?: string;
  };
  plotSizes?: string[];
  highlights?: string[];
  description?: string;
  images?: string[];
  tags?: string[];
  agent?: {
    name: string;
    email: string;
    phone: string;
    photo?: string;
  };
};

const PropertyDetailPage: React.FC = () => {
  const yourToken = localStorage.getItem('token');

  const navigate = useNavigate();

  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  if (id) {
    const yourToken = localStorage.getItem('token') || '';

    fetch(`http://localhost:3000/api/v1/search/property/${id}`, {
      headers: {
        'Authorization': `${yourToken}`,  // make sure 'Bearer' is present if your API expects it
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 401) {
        // Unauthorized - redirect to login
        navigate('/login');
        throw new Error('Unauthorized');
      }
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const prop = Array.isArray(data) ? data[0] : data;
      setProperty(prop);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch property:', err);
      setLoading(false);
    });
  }
}, [id, navigate]);



  const formatPrice = (price?: number) =>
    price ? new Intl.NumberFormat('en-IN').format(price) : '-';
    const nextSlide = () => {
    const images = property?.images ?? [];
    if (images.length === 0) return;
    setCurrentSlide(prev => (prev + 1) % images.length);
    };

    const prevSlide = () => {
    const images = property?.images ?? [];
    if (images.length === 0) return;
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
    };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!property)
    return (
      <div className="text-center py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
        <h2 className="text-2xl font-bold">Property not found</h2>
        <p className="text-gray-400 mt-2">The requested property could not be loaded</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button 
        onClick={() => window.history.back()} 
        className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition"
      >
        <FiChevronLeft className="mr-1" /> Back to listings
      </button>

      {/* Property Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <FiHome className="text-blue-400" />
          {property.title}
        </h1>
        <div className="flex items-center text-gray-300 mt-2 gap-2">
          <FiMapPin className="text-blue-400" />
          <span>{property.address}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Gallery Section */}
        <div className="lg:w-2/3">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/30 to-blue-800/30 aspect-w-16 aspect-h-9 border border-white/10 shadow-xl">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentSlide]}
                  alt={property.title}
                  className="object-cover w-full h-full"
                />
                {/* Slide Indicator */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {currentSlide + 1} / {property.images.length}
                </div>
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/20 transition"
                >
                  <FiChevronLeft className="text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md border border-white/20 transition"
                >
                  <FiChevronRight className="text-white" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto py-2">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentSlide === i ? 'border-blue-500 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="lg:w-1/3">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 sticky top-6">
            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-blue-400">
                ₹{formatPrice(property.price?.basePrice)}
                {property.price?.unit && (
                  <span className="text-base text-gray-300 ml-1">
                    / {property.price.unit}
                  </span>
                )}
              </div>
              {property.price?.otherCharges && (
                <div className="text-sm text-gray-300 mt-1">
                  + ₹{formatPrice(property.price.otherCharges)} other charges
                </div>
              )}
            </div>

            {/* Key Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="bg-blue-900/30 p-3 rounded-lg mr-3 border border-blue-400/20">
                  <FiHome className="text-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Type</div>
                  <div className="font-medium">{property.type}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-green-900/30 p-3 rounded-lg mr-3 border border-green-400/20">
                  <FiLayers className="text-green-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Category</div>
                  <div className="font-medium">{property.category}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-purple-900/30 p-3 rounded-lg mr-3 border border-purple-400/20">
                  <FiMapPin className="text-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Locality</div>
                  <div className="font-medium">{property.locality}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-yellow-900/30 p-3 rounded-lg mr-3 border border-yellow-400/20">
                  <FiCalendar className="text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Possession</div>
                  <div className="font-medium">{property.possession}</div>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
              onClick={() => navigate("/contact")}
              >
                <FiMail className="inline mr-2" />
                Contact Agent
              </button>
              <a 
                href={`https://wa.me/91${property.agent?.phone?.replace(/\D/g, '')}`} 
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg text-center"
              >
                <FaWhatsapp className="inline mr-2" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Highlights */}
          {property.highlights && property.highlights.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Highlights</h2>
              <ul className="space-y-4">
                {property.highlights.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <FiCheckCircle className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Description</h2>
            <p className="text-gray-300">
              {property.description || 'No description available.'}
            </p>
          </div>

          {/* Plot Sizes */}
          {property.plotSizes && property.plotSizes.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Available Sizes</h2>
              <div className="flex flex-wrap gap-3">
                {property.plotSizes.map((size, i) => (
                  <span
                    key={i}
                    className="bg-blue-900/30 border border-blue-400/20 text-blue-100 px-4 py-2 rounded-full text-sm"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Features */}
          {property.tags && property.tags.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <div className="flex flex-wrap gap-2">
                {property.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-800/50 text-gray-200 px-3 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Agent */}
          {property.agent && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
              <div className="flex items-center gap-4 mb-4">
                {property.agent.photo ? (
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-400/50"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-900/30 border border-blue-400/20 flex items-center justify-center">
                    <FiUser className="text-blue-400 text-xl" />
                  </div>
                )}
                <div>
                  <div className="font-semibold">{property.agent.name}</div>
                  <div className="text-gray-300 text-sm">{property.agent.email}</div>
                </div>
              </div>
              <div className="space-y-3">
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                >
                  <FiMail /> Email Agent
                </a>
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  <FiPhone /> {property.agent.phone}
                </a>
                <a
                  href={`https://wa.me/91${property.agent.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* Social Sharing */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Share This Property</h3>
            <div className="flex gap-4 justify-center">
              <button className="p-3 rounded-full bg-blue-600/80 hover:bg-blue-600 transition">
                <FaFacebookF />
              </button>
              <button className="p-3 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 transition">
                <FaInstagram />
              </button>
              <button className="p-3 rounded-full bg-red-600/80 hover:bg-red-600 transition">
                <FaYoutube />
              </button>
              <button className="p-3 rounded-full bg-green-500/80 hover:bg-green-500 transition">
                <FaWhatsapp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;