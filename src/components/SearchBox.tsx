import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const BACKEND_API_URL = import.meta.env.VITE_API_URL;

const allCities = [
  "Agra", "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon",
  "Hyderabad", "Kolkata", "Lucknow", "Mumbai", "Noida", "Pune"
];

const minBudgets = [
  "₹ 5 Thousand", "₹ 10 Thousand", "₹ 30 Thousand","₹ 50 Thousand", "₹ 1 Lakhs", "₹ 5 Lakhs", "₹ 10 Lakhs", "₹ 15 Lakhs", "₹ 20 Lakhs", "₹ 25 Lakhs",
  "₹ 30 Lakhs", "₹ 40 Lakhs"
];
const maxBudgets = [...minBudgets.slice(1)];

const propertyTypes = {
  All: ["Plot", "Independent House", "Apartment", "Villa", "Builder Floor", "Land", "Office Space", "Shop", "Showroom", "Warehouse"],
  Residential: ["Plot", "Independent House", "Apartment", "Villa", "Builder Floor"],
  Commercial: ["Land", "Office Space", "Shop", "Showroom", "Warehouse"]
};

const professionalStatus = ["Ready to use", "Under construction"];

const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [cityInput, setCityInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [propertyCategory, setPropertyCategory] = useState<'All' | 'Residential' | 'Commercial'>('All');
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredCities = useMemo(() =>
    cityInput
      ? allCities.filter(c => c.toLowerCase().includes(cityInput.toLowerCase()))
      : allCities,
    [cityInput]
  );

  useEffect(() => {
    setPropertyType(''); // reset to None when category changes
  }, [propertyCategory]);

  const filteredMaxBudgets = useMemo(() => {
    const minIdx = minBudgets.indexOf(minBudget);
    return minIdx === -1 ? maxBudgets : maxBudgets.slice(minIdx);
  }, [minBudget]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = {};
      if (selectedCity || cityInput) payload.city = selectedCity || cityInput;
      if (minBudget) payload.minBudget = minBudget;
      if (maxBudget) payload.maxBudget = maxBudget;
      // Only include category if it's not "All"
      if (propertyCategory && propertyCategory !== 'All') payload.category = propertyCategory;
      if (propertyType) payload.type = propertyType;
      if (status) payload.status = status;
      if (keyword) payload.keyword = keyword;

      const res = await fetch(`${BACKEND_API_URL}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      navigate('/results', { state: { properties: data } });
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      <form
        onSubmit={handleSearch}
        className="w-full max-w-6xl mx-auto border border-white/20 rounded-2xl px-4 py-6 flex flex-wrap gap-4 items-center justify-center"
        style={{
          background: 'transparent',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* City Input */}
        <div className="relative min-w-[170px] flex-1">
          <input
            type="text"
            placeholder="Select City (None)"
            value={selectedCity || cityInput}
            onFocus={() => setShowCityDropdown(true)}
            onChange={e => {
              setCityInput(e.target.value);
              setSelectedCity('');
              setShowCityDropdown(true);
            }}
            className="w-full px-4 py-3 rounded-lg border border-white/30 bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          />
          {showCityDropdown && (
            <ul className="absolute z-20 bg-[#172236cc] backdrop-blur border border-white/20 rounded-lg mt-1 max-h-48 overflow-auto w-full shadow-xl">
              <li
                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                onClick={() => {
                  setSelectedCity('');
                  setCityInput('');
                  setShowCityDropdown(false);
                }}
              >
                None
              </li>
              {filteredCities.length === 0 ? (
                <li className="px-4 py-2 text-white/70">No results</li>
              ) : (
                filteredCities.slice(0, 10).map(city => (
                  <li
                    key={city}
                    className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                    onClick={() => {
                      setSelectedCity(city);
                      setCityInput('');
                      setShowCityDropdown(false);
                    }}
                  >
                    {city}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* Budget Dropdowns */}
        {[
          ['Min Budget', minBudget, setMinBudget, minBudgets],
          ['Max Budget', maxBudget, setMaxBudget, filteredMaxBudgets]
        ].map(([label, val, setter, list], i) => (
          <select
            key={i}
            value={val as string}
            onChange={(e) => (setter as (value: string) => void)(e.target.value)}
            className="min-w-[120px] px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isLoading}
          >
            <option value="">{label as string} (None)</option>
            {(list as string[]).map(b => (
              <option key={b} value={b} style={{ backgroundColor: '#172236cc', color: 'white' }}>
                {b}
              </option>
            ))}
          </select>
        ))}

        {/* Category Toggle */}
        <div className="flex gap-2 bg-white/10 rounded-lg p-1 backdrop-blur">
          {(['All', 'Residential', 'Commercial'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setPropertyCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                propertyCategory === cat
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-transparent text-white/80 hover:bg-white/10'
              }`}
              disabled={isLoading}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Property Type */}
        <select
          value={propertyType}
          onChange={e => setPropertyType(e.target.value)}
          className="min-w-[150px] px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={isLoading}
        >
          <option value="">Any Property Type</option>
          {propertyTypes[propertyCategory].map(type => (
            <option key={type} value={type} style={{ backgroundColor: '#172236cc', color: 'white' }}>
              {type}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="min-w-[160px] px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={isLoading}
        >
          <option value="">Any Status</option>
          {professionalStatus.map(status => (
            <option key={status} value={status} style={{ backgroundColor: '#172236cc', color: 'white' }}>
              {status}
            </option>
          ))}
        </select>

        {/* Keyword */}
        <input
          type="text"
          placeholder="Search by Project, Locality, or Builder"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="flex-1 min-w-[180px] px-4 py-3 rounded-lg border border-white/30 bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          disabled={isLoading}
        />

        {/* Submit */}
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </>
  );
};

export default SearchBox;
