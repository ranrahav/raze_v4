import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Country } from '@/types/form';

interface CountrySelectProps {
  label: string;
  placeholder: string;
  maxSelections: number;
  selected: Country[];
  onChange: (countries: Country[]) => void;
}

const countries: Country[] = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'PT', name: 'Portugal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IS', name: 'Iceland' },
  { code: 'SG', name: 'Singapore' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IL', name: 'Israel' },
  { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'IN', name: 'India' }
];

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  placeholder,
  maxSelections,
  selected,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const filteredCountries = countries.filter(
    country =>
      country.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some(c => c.code === country.code)
  );

  const handleSelect = (country: Country) => {
    if (selected.length < maxSelections) {
      onChange([...selected, country]);
      setSearch('');
      setIsOpen(false);
    }
  };

  const removeCountry = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(country => country.code !== code));
  };

  return (
    <div className="relative">
      <label className="block text-lg font-medium text-white mb-4">
        {label}
        {maxSelections && (
          <span className="text-gray-300 ml-2">
            (Up to {maxSelections} {maxSelections === 1 ? 'country' : 'countries'})
          </span>
        )}
      </label>
      <div className="relative">
        <div
          className="w-full min-h-[3.5rem] p-3 bg-gray-700 rounded-xl cursor-text border border-gray-600 hover:border-gray-500 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-wrap gap-2">
            {selected.map(country => (
              <span
                key={country.code}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {country.name}
                <button
                  onClick={(e) => removeCountry(country.code, e)}
                  className="hover:text-white/70 focus:outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder={selected.length === 0 ? placeholder : ''}
              className="flex-1 bg-transparent text-white placeholder-gray-400 min-w-[120px] focus:outline-none"
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute w-full mt-2 py-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-50 max-h-[300px] overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-2 text-gray-400">No countries found</div>
            ) : (
              filteredCountries.map(country => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 text-white flex items-center justify-between group"
                >
                  {country.name}
                  <Check className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySelect;