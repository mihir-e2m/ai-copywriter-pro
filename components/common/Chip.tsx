
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
      className={`px-3.5 py-1.5 text-sm font-semibold rounded-full border transition-all duration-200 transform hover:scale-105 active:scale-95
        ${selected
          ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-md'
          : 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800/50 hover:border-slate-400 dark:hover:border-white/30 shadow-sm'
        }`
      }
      aria-pressed={selected}
    >
      {label}
    </button>
  );
};
