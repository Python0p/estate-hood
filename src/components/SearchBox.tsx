import React, { useState, useMemo, useEffect } from 'react';

const allCities = [
  "Agra", "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Kolkata", "Lucknow", "Mumbai", "Noida", "Pune"
];

const minBudgets = [
  "₹ 5 Lakhs", "₹ 10 Lakhs", "₹ 15 Lakhs", "₹ 20 Lakhs", "₹ 25 Lakhs", "₹ 30 Lakhs", "₹ 40 Lakhs", "₹ 50 Lakhs", "₹ 60 Lakhs", "₹ 75 Lakhs", "₹ 90 Lakhs", "₹ 1 Crore", "₹ 1.25 Crore", "₹ 1.5 Crore", "₹ 1.75 Crore", "₹ 2 Crore", "₹ 3 Crore", "₹ 4 Crore", "₹ 5 Crore", "₹ 10 Crore", "₹ 20 Crore", "₹ 30 Crore", "₹ 50 Crore", "₹ 75 Crore"
];
const maxBudgets = [
  "₹ 10 Lakhs", "₹ 15 Lakhs", "₹ 20 Lakhs", "₹ 25 Lakhs", "₹ 30 Lakhs", "₹ 40 Lakhs", "₹ 50 Lakhs", "₹ 60 Lakhs", "₹ 75 Lakhs", "₹ 90 Lakhs", "₹ 1 Crore", "₹ 1.25 Crore", "₹ 1.5 Crore", "₹ 1.75 Crore", "₹ 2 Crore", "₹ 3 Crore", "₹ 4 Crore", "₹ 5 Crore", "₹ 10 Crore", "₹ 20 Crore", "₹ 30 Crore", "₹ 50 Crore", "₹ 75 Crore"
];

const propertyTypes = {
  Residential: ["Plot", "Independent House", "Apartment", "Villa", "Builder Floor"],
  Commercial: ["Land", "Office Space", "Shop", "Showroom", "Warehouse"]
};

const professionalStatus = ["Ready to use", "Under construction"];

const SearchBox: React.FC = () => {
  const [cityInput, setCityInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [propertyCategory, setPropertyCategory] = useState<'Residential' | 'Commercial'>('Residential');
  const [propertyType, setPropertyType] = useState(propertyTypes['Residential'][0]);
  const [status, setStatus] = useState(professionalStatus[0]);
  const [keyword, setKeyword] = useState('');

  const filteredCities = useMemo(() =>
    cityInput
      ? allCities.filter(c => c.toLowerCase().includes(cityInput.toLowerCase()))
      : allCities,
    [cityInput]
  );

  useEffect(() => {
    setPropertyType(propertyTypes[propertyCategory][0]);
  }, [propertyCategory]);

  const filteredMaxBudgets = useMemo(() => {
    const minIdx = minBudgets.indexOf(minBudget);
    return minIdx === -1 ? maxBudgets : maxBudgets.slice(minIdx);
  }, [minBudget]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `City: ${selectedCity || cityInput}\nMin Budget: ${minBudget}\nMax Budget: ${maxBudget}\nProperty: ${propertyCategory} - ${propertyType}\nStatus: ${status}\nKeyword: ${keyword}`
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-6xl mx-auto bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl px-4 py-6 flex flex-wrap gap-4 items-center justify-center"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
    >
      {/* City Autocomplete */}
      <div className="relative min-w-[170px] flex-1">
        <input
          type="text"
          placeholder="Select City"
          value={selectedCity || cityInput}
          onFocus={() => setShowCityDropdown(true)}
          onChange={e => {
            setCityInput(e.target.value);
            setSelectedCity('');
            setShowCityDropdown(true);
          }}
          className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 placeholder-gray-500"
        />
        {showCityDropdown && (
          <ul className="absolute z-20 bg-white/95 border border-white/30 rounded-lg mt-1 max-h-48 overflow-auto w-full shadow-lg">
            {filteredCities.length === 0 && (
              <li className="px-4 py-2 text-gray-400">No results</li>
            )}
            {filteredCities.slice(0, 10).map(city => (
              <li
                key={city}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  setSelectedCity(city);
                  setCityInput('');
                  setShowCityDropdown(false);
                }}
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Budget Min/Max */}
      <select
        value={minBudget}
        onChange={e => setMinBudget(e.target.value)}
        className="min-w-[120px] px-4 py-3 rounded-lg border border-white/30 bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
      >
        <option value="">Min Budget</option>
        {minBudgets.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
      <select
        value={maxBudget}
        onChange={e => setMaxBudget(e.target.value)}
        className="min-w-[120px] px-4 py-3 rounded-lg border border-white/30 bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
      >
        <option value="">Max Budget</option>
        {filteredMaxBudgets.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      {/* Property Type Tabs */}
      <div className="flex gap-2 bg-blue-100/40 rounded-lg p-1 backdrop-blur">
        {(['Residential', 'Commercial'] as const).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setPropertyCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              propertyCategory === cat
                ? 'bg-blue-600 text-white shadow'
                : 'bg-transparent text-blue-700 hover:bg-blue-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Property Sub-Type */}
      <select
        value={propertyType}
        onChange={e => setPropertyType(e.target.value)}
        className="min-w-[150px] px-4 py-3 rounded-lg border border-white/30 bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
      >
        {propertyTypes[propertyCategory].map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      {/* Professional Status */}
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="min-w-[160px] px-4 py-3 rounded-lg border border-white/30 bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
      >
        {professionalStatus.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>

      {/* Keyword Search */}
      <input
        type="text"
        placeholder="Search by Project, Locality, or Builder"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        className="flex-1 min-w-[180px] px-4 py-3 rounded-lg border border-white/30 bg-white/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 placeholder-gray-500"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
