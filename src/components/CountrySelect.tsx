import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label';
import { Country } from '@/types/form';

interface CountrySelectProps {
  label: string;
  placeholder: string;
  selected: { code: string; name: string; }[];
  onChange: (countries: { code: string; name: string; }[]) => void;
  className?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  placeholder,
  selected,
  onChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const toggleCountry = (country: Country) => {
    const isSelected = selected.some(c => c.code === country.code);
    if (isSelected) {
      onChange(selected.filter(c => c.code !== country.code));
    } else {
      onChange([...selected, country]);
    }
    setIsOpen(false);
    setSearch('');
  };

  const removeCountry = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(c => c.code !== code));
  };

  const countries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'IE', name: 'Ireland' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'SG', name: 'Singapore' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'IL', name: 'Israel' },
    { code: 'AE', name: 'United Arab Emirates' },
  ];

  const filteredCountries = countries
    .filter(country => 
      country.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some(c => c.code === country.code)
    );

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label className="block text-lg font-medium mb-4">{label}</Label>
      <div className="relative">
        <div
          className={cn(
            "w-full min-h-[3.5rem] p-3 rounded-xl cursor-text border hover:border-gray-400 transition-colors",
            className
          )}
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
              className="flex-1 bg-transparent min-w-[120px] focus:outline-none"
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute w-full mt-2 py-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[300px] overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No countries found</div>
            ) : (
              filteredCountries.map(country => (
                <button
                  key={country.code}
                  onClick={() => toggleCountry(country)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-900 flex items-center justify-between group"
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