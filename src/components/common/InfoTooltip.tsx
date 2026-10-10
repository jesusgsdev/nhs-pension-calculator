import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  title?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-nhs-blue hover:text-nhs-darkBlue p-0.5 rounded-full hover:bg-blue-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-nhs-blue"
        aria-label="More information"
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl pointer-events-none animate-fadeIn border border-slate-700">
          {title && <p className="font-semibold text-sky-300 mb-1">{title}</p>}
          <p className="leading-relaxed text-slate-200">{content}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

