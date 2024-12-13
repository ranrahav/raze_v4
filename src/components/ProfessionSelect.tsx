import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label';
import { Profession } from '@/types/form';

interface ProfessionSelectProps {
  label: string;
  placeholder: string;
  selected?: Profession[];
  onChange: (professions: Profession[]) => void;
  className?: string;
}

const ProfessionSelect: React.FC<ProfessionSelectProps> = ({
  label,
  placeholder,
  selected = [],
  onChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleProfession = (profession: Profession) => {
    const isSelected = (selected || []).some(p => p.id === profession.id);
    if (isSelected) {
      onChange((selected || []).filter(p => p.id !== profession.id));
    } else {
      onChange([...(selected || []), profession]);
    }
    setIsOpen(false);
    setSearch('');
  };

  const removeProfession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((selected || []).filter(profession => profession.id !== id));
  };

  const commonProfessions = [
    { id: "software-engineer", name: "Software Engineer" },
    { id: "product-manager", name: "Product Manager" },
    { id: "data-scientist", name: "Data Scientist" },
    { id: "designer", name: "Designer" },
    { id: "marketing", name: "Marketing" },
    { id: "sales", name: "Sales" },
    { id: "finance", name: "Finance" },
    { id: "hr", name: "HR" },
    { id: "operations", name: "Operations" },
    { id: "legal", name: "Legal" },
    { id: "healthcare", name: "Healthcare" },
    { id: "education", name: "Education" },
    { id: "other", name: "Other" }
  ];

  const filteredProfessions = commonProfessions
    .filter(profession => 
      profession.name.toLowerCase().includes(search.toLowerCase()) &&
      !(selected || []).some(p => p.id === profession.id)
    );

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label className="block text-lg font-medium mb-4">{label}</Label>
      <div className="relative">
        <div
          className={cn(
            "w-full min-h-[3.5rem] p-3 rounded-xl cursor-text border hover:border-gray-400 transition-colors",
            "bg-gray-100 text-gray-900 border-gray-200",
            className
          )}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex flex-wrap gap-2">
            {(selected || []).map(profession => (
              <span
                key={profession.id}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {profession.name}
                <button
                  onClick={(e) => removeProfession(profession.id, e)}
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
              placeholder={(selected || []).length === 0 ? placeholder : ''}
              className="flex-1 bg-transparent min-w-[120px] focus:outline-none"
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute w-full mt-2 py-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[300px] overflow-y-auto">
            {filteredProfessions.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No professions found</div>
            ) : (
              filteredProfessions.map(profession => (
                <button
                  key={profession.id}
                  onClick={() => toggleProfession(profession)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-900 flex items-center justify-between group"
                >
                  {profession.name}
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

export default ProfessionSelect;