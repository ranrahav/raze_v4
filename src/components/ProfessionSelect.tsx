import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Profession {
  id: string;
  name: string;
}

interface ProfessionSelectProps {
  label: string;
  placeholder: string;
  selected: Profession | null;
  onChange: (profession: Profession | null) => void;
}

const commonProfessions: Profession[] = [
  { id: '1', name: 'Software Engineer' },
  { id: '2', name: 'Doctor' },
  { id: '3', name: 'Teacher' },
  { id: '4', name: 'Business Analyst' },
  { id: '5', name: 'Designer' },
  { id: '6', name: 'Marketing Manager' },
  { id: '7', name: 'Accountant' },
  { id: '8', name: 'Lawyer' },
  { id: '9', name: 'Chef' },
  { id: '10', name: 'Architect' },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (!isOpen && !isOtherSelected) setIsOpen(true);
  };

  const handleCustomProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomProfession(value);
    onChange({ id: 'custom', name: value });
  };

  const filteredProfessions = commonProfessions.filter(
    profession =>
      profession.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (profession: Profession) => {
    if (profession.id === 'other') {
      setIsOtherSelected(true);
      setSearch('');
      setIsOpen(false);
      onChange(null);
    } else {
      onChange(profession);
      setIsOtherSelected(false);
      setSearch('');
      setCustomProfession('');
      setIsOpen(false);
    }
  };

  const removeProfession = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setIsOtherSelected(false);
    setCustomProfession('');
    setSearch('');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
        <div className="relative">
          <div
            className="w-full min-h-[3.5rem] p-3 bg-white/10 border border-white/20 rounded-xl cursor-text"
            onClick={() => !isOtherSelected && setIsOpen(true)}
          >
            <div className="flex flex-wrap gap-2">
              {selected && !isOtherSelected ? (
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {selected.name}
                  <button
                    onClick={removeProfession}
                    className="hover:text-white/70 focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ) : !isOtherSelected ? (
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/50 min-w-[200px]"
                  placeholder={placeholder}
                  value={search}
                  onChange={handleInputChange}
                  onFocus={() => setIsOpen(true)}
                />
              ) : null}
            </div>
          </div>

          {isOpen && !isOtherSelected && (
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
                  {filteredProfessions.map(profession => (
                    <div
                      key={profession.id}
                      className="p-3 cursor-pointer flex items-center justify-between hover:bg-gray-50"
                      onClick={() => handleSelect(profession)}
                    >
                      <span className="text-gray-700">{profession.name}</span>
                      {selected?.id === profession.id && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {isOtherSelected && (
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Please specify your profession
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl outline-none text-white placeholder-white/50"
              placeholder="Type your profession..."
              value={customProfession}
              onChange={handleCustomProfessionChange}
              autoFocus
            />
            <button
              onClick={removeProfession}
              className="p-3 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionSelect;