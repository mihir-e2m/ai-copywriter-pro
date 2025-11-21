
import React from 'react';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const Chip: React.FC<ChipProps> = ({ label, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200
        ${selected
          ? 'bg-orange-600 border-orange-600 text-white'
          : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:border-white/30'
        }`
      }
      aria-pressed={selected}
    >
      {label}
    </button>
  );
};
