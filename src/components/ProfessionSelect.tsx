import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Profession } from '@/types/form';

interface ProfessionSelectProps {
  label: string;
  placeholder: string;
  selected: Profession[];
  onChange: (professions: Profession[]) => void;
}

const commonProfessions: Profession[] = [
  { id: 'software-engineer', name: 'Software Engineer' },
  { id: 'doctor', name: 'Doctor' },
  { id: 'teacher', name: 'Teacher' },
  { id: 'business-analyst', name: 'Business Analyst' },
  { id: 'designer', name: 'Designer' },
  { id: 'marketing-manager', name: 'Marketing Manager' },
  { id: 'accountant', name: 'Accountant' },
  { id: 'lawyer', name: 'Lawyer' },
  { id: 'chef', name: 'Chef' },
  { id: 'architect', name: 'Architect' },
  { id: 'other', name: 'Other' }
];

const ProfessionSelect: React.FC<ProfessionSelectProps> = ({
  label,
  placeholder,
  selected,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customProfession, setCustomProfession] = useState('');
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
    const value = e.target.value;
    setSearch(value);
    if (!isOpen) setIsOpen(true);
  };

  const handleCustomProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomProfession(value);
    const newProfessions = selected.filter(p => p.id !== 'custom');
    if (value) {
      onChange([...newProfessions, { id: 'custom', name: value }]);
    } else {
      onChange(newProfessions);
    }
  };

  const toggleProfession = (profession: Profession) => {
    if (profession.id === 'other') {
      setIsOtherSelected(!isOtherSelected);
      setCustomProfession('');
      onChange(selected.filter(p => p.id !== 'custom'));
      setIsOpen(false);
      return;
    }

    const isSelected = selected.some(p => p.id === profession.id);
    if (isSelected) {
      onChange(selected.filter(p => p.id !== profession.id));
    } else {
      onChange([...selected, profession]);
    }
    setSearch('');
    setIsOpen(false);
  };

  const filteredProfessions = commonProfessions.filter(profession =>
    profession.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-lg font-medium text-white mb-4">{label}</label>
      <div className="relative">
        <div
          className="w-full min-h-[3.5rem] p-3 bg-gray-700 rounded-xl cursor-text border border-gray-600 hover:border-gray-500 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-wrap gap-2">
            {selected.map(profession => (
              <span
                key={profession.id}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {profession.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProfession(profession);
                  }}
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
            {filteredProfessions.length === 0 ? (
              <div className="px-4 py-2 text-gray-400">No professions found</div>
            ) : (
              filteredProfessions.map(profession => (
                <button
                  key={profession.id}
                  onClick={() => toggleProfession(profession)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 text-white flex items-center justify-between group"
                >
                  {profession.name}
                  {selected.some(p => p.id === profession.id) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {isOtherSelected && (
        <input
          type="text"
          className="w-full p-3 bg-gray-700 rounded-xl text-white placeholder-gray-400 border border-gray-600 focus:border-gray-500 focus:outline-none"
          placeholder="Enter your profession"
          value={customProfession}
          onChange={handleCustomProfessionChange}
        />
      )}
    </div>
  );
};

export default ProfessionSelect;