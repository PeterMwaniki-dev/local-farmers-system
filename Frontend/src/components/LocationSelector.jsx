import { useState, useEffect } from 'react';
import { KENYAN_COUNTIES } from '../data/kenyanCounties';
import { useSettings } from '../contexts/SettingsContext';

const LocationSelector = ({ selectedLocation, onSelectLocation, placeholder = "Select County" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useSettings();

  // Filter counties based on search term
  const filteredCounties = KENYAN_COUNTIES.filter(county =>
    county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting a county
  const handleSelect = (county) => {
    onSelectLocation(county);
    setSearchTerm(county);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-green-500 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-auto ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {filteredCounties.length > 0 ? (
            filteredCounties.map((county, index) => (
              <button
                key={index}
                onClick={() => handleSelect(county)}
                className={`w-full text-left px-4 py-2 hover:bg-opacity-50 transition ${
                  darkMode 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-900 hover:bg-gray-100'
                } ${selectedLocation === county ? (darkMode ? 'bg-gray-700' : 'bg-green-50') : ''}`}
              >
                {county}
              </button>
            ))
          ) : (
            <div className={`px-4 py-3 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No counties found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
