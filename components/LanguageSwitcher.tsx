
import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ currentLang, onSelect }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-full border border-slate-200">
      {(['en', 'ta', 'hi'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onSelect(lang)}
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
            currentLang === lang 
              ? 'bg-white text-sky-600 shadow-sm' 
              : 'text-slate-500 hover:text-sky-500'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
