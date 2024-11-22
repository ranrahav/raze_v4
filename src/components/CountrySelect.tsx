import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Country {
  code: string;
  name: string;
}

interface CountrySelectProps {
  label: string;
  placeholder: string;
  maxSelections: number;
  selected: Country[];
  onChange: (countries: Country[]) => void;
}

const countries: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  // Add more countries as needed
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
      <label className="block text-sm font-medium text-white mb-2">
        {label}
        {maxSelections && (
          <span className="text-white/70 ml-2">
            (Up to {maxSelections} {maxSelections === 1 ? 'country' : 'countries'})
          </span>
        )}
      </label>
      <div className="relative">
        <div
          className="w-full min-h-[3.5rem] p-3 bg-white/10 border border-white/20 rounded-xl cursor-text"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-wrap gap-2">
            {selected.map(country => (
              <span
                key={country.code}
                className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
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
            {selected.length < maxSelections && (
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-white placeholder-white/50 min-w-[200px]"
                placeholder={selected.length === 0 ? placeholder : "Type to search..."}
                value={search}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
              />
            )}
          </div>
        </div>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10"
              onClick={() => {
                setIsOpen(false);
                setSearch('');
              }}
            />
            <Card className="absolute z-20 w-full mt-2 bg-white border-0 shadow-lg rounded-xl overflow-hidden">
              <div className="max-h-60 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <div className="p-3 text-gray-500 text-center">No countries found</div>
                ) : (
                  filteredCountries.map(country => (
                    <div
                      key={country.code}
                      className="p-3 cursor-pointer flex items-center justify-between hover:bg-gray-50"
                      onClick={() => handleSelect(country)}
                    >
                      <span className="text-gray-700">{country.name}</span>
                      {selected.some(c => c.code === country.code) && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default CountrySelect;