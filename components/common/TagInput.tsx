
import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center w-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 transition hover:border-slate-400 dark:hover:border-white/30 shadow-sm">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center bg-gradient-to-r from-orange-500/40 to-orange-600/40 text-orange-100 dark:text-orange-100 rounded-md px-2.5 py-1 text-sm mr-2 mb-1 mt-1 shadow-sm border border-orange-400/30">
          {tag}
          <button onClick={() => removeTag(tag)} className="ml-1.5 text-orange-200 hover:text-white transition-colors">
            <XIcon />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow bg-transparent outline-none p-1 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500"
        placeholder={tags.length === 0 ? placeholder : 'Add more...'}
      />
    </div>
  );
};
