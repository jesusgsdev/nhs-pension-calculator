import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface ExplainCardProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const ExplainCard: React.FC<ExplainCardProps> = ({
  title,
  badge,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-colors hover:border-slate-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left focus:outline-none focus:bg-slate-100"
      >
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-nhs-blue shrink-0" />
          <span className="text-sm font-semibold text-slate-800">{title}</span>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-nhs-blue border border-blue-200">
              {badge}
            </span>
          )}
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

