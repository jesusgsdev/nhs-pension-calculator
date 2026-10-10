import React from 'react';
import { RoleType } from '../../types/afc';
import { BookOpen, Sparkles, UserCheck } from 'lucide-react';

interface HeaderProps {
  role: RoleType;
  onRoleChange: (newRole: RoleType) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  onRoleChange,
  onOpenGuide,
}) => {
  return (
    <header className="bg-nhs-blue text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="py-3 sm:py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white text-nhs-blue px-2.5 py-1 font-black text-lg sm:text-xl rounded-sm tracking-tighter shadow-xs flex items-center select-none shrink-0">
              NHS
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white leading-tight">
                  Nurse & Midwife Pay and Pension Calculator
                </h1>
                <span className="bg-sky-400/25 text-sky-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-sky-300/30 whitespace-nowrap hidden sm:inline-block">
                  England 2025/26
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-sky-100 mt-0.5 hidden md:block">
                Agenda for Change bands • London HCAS • Shift rotas • 1995/2008/2015 schemes • McCloud remedy
              </p>
            </div>
          </div>

          {/* Controls: Role Switcher & Guide Button */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 flex-wrap gap-y-2 w-full md:w-auto">
            
            {/* Role Switcher */}
            <div className="bg-nhs-darkBlue/90 p-1 rounded-xl flex items-center border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => onRoleChange('nurse')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] ${
                  role === 'nurse'
                    ? 'bg-white text-nhs-blue shadow-xs'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Nurse</span>
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('midwife')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] ${
                  role === 'midwife'
                    ? 'bg-white text-nhs-blue shadow-xs'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Midwife</span>
              </button>
            </div>

            {/* Guide Button */}
            <button
              type="button"
              onClick={onOpenGuide}
              className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/20 transition-all text-white focus:outline-hidden focus:ring-2 focus:ring-white min-h-[34px]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
