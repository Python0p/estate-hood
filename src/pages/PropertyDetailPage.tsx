import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiMapPin, FiHome, FiLayers, FiCalendar, FiMail, FiUser, FiCheckCircle,
    FiChevronLeft, FiChevronRight, FiX, FiShare2
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// Assume BACKEND_API_URL is configured in your environment variables
const BACKEND_API_URL = import.meta.env.VITE_API_URL;

// --- TYPE DEFINITION ---
type Property = {
    _id: string;
    title: string;
    address: string;
    type: string;
    city: string;
    category:string;
    locality: string;
    possession: string;
    price?: { basePrice?: number; unit?: string; otherCharges?: number; };
    plotSizes?: string[];
    highlights?: string[];
    description?: string;
    images?: string[];
    tags?: string[];
    agent?: { name: string; email: string; phone: string; photo?: string; };
};

// --- MODAL COMPONENT ---
const ImageModal: React.FC<{
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: (e: React.MouseEvent) => void;
    onPrev: (e: React.MouseEvent) => void;
}> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowRight') onNext(new MouseEvent('click') as any);
            if (event.key === 'ArrowLeft') onPrev(new MouseEvent('click') as any);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    if (!images || images.length === 0) return null;

    return (
        <div
            className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors z-50" aria-label="Close image view">
                <FiX size={36} />
            </button>

            {images.length > 1 && (
                <>
                    <button onClick={onPrev} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 focus:outline-none z-50" aria-label="Previous image">
                        <FiChevronLeft size={30} />
                    </button>
                    <button onClick={onNext} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 focus:outline-none z-50" aria-label="Next image">
                        <FiChevronRight size={30} />
                    </button>
                </>
            )}

            <div className="relative p-4 flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <img src={images[currentIndex]} alt="Full screen property view" className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                {images.length > 1 && (
                    <div className="text-white bg-black/50 px-3 py-1 rounded-full text-sm font-semibold">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const PropertyDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem('token') || '';
            fetch(`${BACKEND_API_URL}/api/v1/search/property/${id}`, { headers: { 'Authorization': `${token}` } })
                .then(res => {
                    if (res.status === 401) navigate('/login');
                    if (!res.ok) throw new Error('Failed to fetch');
                    return res.json();
                })
                .then(data => setProperty(Array.isArray(data) ? data[0] : data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id, navigate]);

    // --- Helper Functions ---
    const formatPrice = (price?: number) =>
        price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price) : 'N/A';

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        const images = property?.images ?? [];
        if (images.length > 1) setCurrentSlide(prev => (prev + 1) % images.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        const images = property?.images ?? [];
        if (images.length > 1) setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setCurrentSlide(index);
    };

    const openModal = () => {
        if (property?.images && property.images.length > 0) {
            setIsModalOpen(true);
        }
    };

    // --- Render Logic ---
    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500"></div>
        </div>
    );

    if (!property) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-center px-4">
            <h2 className="text-3xl font-bold text-red-500">Property Not Found</h2>
            <p className="text-gray-400 mt-3">The property you are looking for could not be loaded.</p>
            <button onClick={() => navigate(-1)} className="mt-8 flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105">
                <FiChevronLeft className="mr-2" /> Back
            </button>
        </div>
    );

    const { title, address, images, price, highlights, description, plotSizes, tags, agent } = property;

    return (
        <>
            {isModalOpen && images && (
                <ImageModal
                    images={images}
                    currentIndex={currentSlide}
                    onClose={() => setIsModalOpen(false)}
                    onNext={nextSlide}
                    onPrev={prevSlide}
                />
            )}
            <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => navigate(-1)} className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300 text-sm font-medium">
                            <FiChevronLeft size={20} className="mr-1" />
                            Back
                        </button>
                        <div className="flex items-center space-x-3">
                            <button className="flex items-center space-x-2 rounded-lg bg-gray-800/60 hover:bg-gray-700/80 px-4 py-2 border border-gray-700 transition-all duration-300">
                                <FiShare2 size={16} className="text-cyan-400"/>
                                <span className="text-sm font-medium">Share</span>
                            </button>
                        </div>
                    </div>

                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{title}</h1>
                        <div className="flex items-center text-gray-400 mt-3 gap-2 text-base">
                            <FiMapPin className="text-cyan-400" />
                            <span>{address}</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* --- Image Gallery --- */}
                            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shadow-2xl">
                                {images && images.length > 0 ? (
                                    <>
                                        <button onClick={openModal} className="w-full h-full cursor-pointer" aria-label="View image in full screen">
                                             <img src={images[currentSlide]} alt={`${title} - slide ${currentSlide + 1}`} className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"/>
                                        </button>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                                        {images.length > 1 && (
                                            <>
                                                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"><FiChevronLeft size={24} /></button>
                                                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"><FiChevronRight size={24} /></button>
                                            </>
                                        )}
                                    </>
                                ) : ( <div className="w-full h-full flex items-center justify-center text-gray-500">No Images Available</div> )}
                            </div>
                            {images && images.length > 1 && (
                                <div className="flex gap-3 -mt-4 pb-2 overflow-x-auto">
                                    {images.map((img, i) => (
                                        <button key={i} onClick={(e) => handleThumbnailClick(e, i)} className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${currentSlide === i ? 'ring-4 ring-cyan-500' : 'opacity-60 hover:opacity-100'}`}>
                                            <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                             {highlights && highlights.length > 0 && (
                                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-5 text-white">Property Highlights</h2>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        {highlights.map((item, i) => ( <li key={i} className="flex items-center"><FiCheckCircle className="text-cyan-400 mr-3 flex-shrink-0" size={20} /> <span className="text-gray-300">{item}</span></li> ))}
                                    </ul>
                                </div>
                            )}

                            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold mb-4 text-white">Description</h2>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{description || 'No description available.'}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {plotSizes && plotSizes.length > 0 && (
                                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 text-white">Available Plot Sizes</h2>
                                        <div className="flex flex-wrap gap-3">
                                            {plotSizes.map((size, i) => (<span key={i} className="bg-cyan-900/50 border border-cyan-700/60 text-cyan-200 px-4 py-2 rounded-full text-sm font-medium">{size}</span>))}
                                        </div>
                                    </div>
                                )}
                                {tags && tags.length > 0 && (
                                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 text-white">Tags & Features</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, i) => (<span key={i} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">{tag}</span>))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-8">
                                <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-6">
                                    <div className="border-b border-gray-700 pb-5 mb-5">
                                        <p className="text-gray-400 text-sm">Starting From</p>
                                        <div className="text-4xl font-bold text-cyan-400">{formatPrice(price?.basePrice)}</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center"><span className="font-medium text-gray-400 flex items-center"><FiHome className="mr-2 text-cyan-500"/>Type</span><span className="font-bold text-white">{property.type}</span></div>
                                        <div className="flex justify-between items-center"><span className="font-medium text-gray-400 flex items-center"><FiLayers className="mr-2 text-cyan-500"/>Category</span><span className="font-bold text-white">{property.category}</span></div>
                                        <div className="flex justify-between items-center"><span className="font-medium text-gray-400 flex items-center"><FiMapPin className="mr-2 text-cyan-500"/>Locality</span><span className="font-bold text-white">{property.locality}</span></div>
                                        <div className="flex justify-between items-center"><span className="font-medium text-gray-400 flex items-center"><FiCalendar className="mr-2 text-cyan-500"/>Possession</span><span className="font-bold text-white">{property.possession}</span></div>
                                    </div>
                                </div>
                                {agent && (
                                    <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-6">
                                        <h3 className="text-xl font-bold mb-4 text-white">Contact Agent</h3>
                                        <div className="flex items-center gap-4 mb-5">
                                            {agent.photo ? (
                                                <img src={agent.photo} alt={agent.name} className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-cyan-800 flex items-center justify-center"><FiUser className="text-cyan-400 text-2xl" /></div>
                                            )}
                                            <div>
                                                <div className="font-bold text-lg text-white">{agent.name}</div>
                                                <a href={`mailto:${agent.email}`} className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">{agent.email}</a>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <button onClick={() => navigate("/contact")} className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105">
                                                <FiMail className="mr-2" /> Request Callback
                                            </button>
                                            <a href={`https://wa.me/91${agent.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105">
                                                <FaWhatsapp className="mr-2" /> Chat on WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyDetailPage;