import React from 'react';
import { RoleType } from '../../types/afc';
import { PensionProfile } from '../../types/pension';
import { InfoTooltip } from '../common/InfoTooltip';
import { Shield, Sparkles, UserCheck, Calendar } from 'lucide-react';

interface RoleAndProfileSectionProps {
  role: RoleType;
  onRoleChange: (r: RoleType) => void;
  profile: PensionProfile;
  onProfileChange: (p: Partial<PensionProfile>) => void;
}

export const RoleAndProfileSection: React.FC<RoleAndProfileSectionProps> = ({
  role,
  onRoleChange,
  profile,
  onProfileChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-sm space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
            1. Role & Profile
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your clinical profession and fundamental pension scheme eligibility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Clinical Role
            <InfoTooltip
              title="Nurse vs Midwife"
              content="Selecting your role customizes typical career advancement templates, job titles, and preceptorship pathways (e.g. fast-track Band 5 to 6 for Midwives)."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onRoleChange('nurse')}
              className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl border text-xs font-bold transition-all min-h-[42px] ${
                role === 'nurse'
                  ? 'border-nhs-blue bg-blue-50 text-nhs-blue shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-nhs-blue" />
              <span>Nurse</span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('midwife')}
              className={`flex items-center justify-center space-x-2 py-3 px-3 rounded-xl border text-xs font-bold transition-all min-h-[42px] ${
                role === 'midwife'
                  ? 'border-nhs-blue bg-blue-50 text-nhs-blue shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Midwife</span>
            </button>
          </div>
        </div>

        {/* Current Age & Career Start Year */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Age
            </label>
            <div className="relative">
              <input
                type="number"
                min="20"
                max="75"
                value={profile.currentAge}
                onChange={(e) => onProfileChange({ currentAge: Number(e.target.value) })}
                className="w-full px-3 py-2.5 text-base sm:text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-nhs-blue focus:border-nhs-blue bg-slate-50 min-h-[42px]"
              />
              <span className="absolute right-3 top-3 text-xs text-slate-400 font-semibold">yrs</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Career Start
              <InfoTooltip
                title="Scheme Joining Year"
                content="Joining prior to 1 April 2008 enrolls you in the 1995 Section. Joining between 2008 and 2015 enrolls you in the 2008 Section. Service prior to 2012 also qualifies for the McCloud Remedy."
              />
            </label>
            <div className="relative">
              <input
                type="number"
                min="1980"
                max="2026"
                value={profile.startCareerYear}
                onChange={(e) => onProfileChange({ startCareerYear: Number(e.target.value) })}
                className="w-full px-3 py-2.5 text-base sm:text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-nhs-blue focus:border-nhs-blue bg-slate-50 min-h-[42px]"
              />
              <Calendar className="w-3.5 h-3.5 absolute right-3 top-3 text-slate-400" />
            </div>
          </div>
        </div>

        {/* State Pension Age */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            State Pension Age
            <InfoTooltip
              title="2015 Scheme Normal Pension Age"
              content="Under the 2015 Scheme, your Normal Pension Age (NPA) matches your UK State Pension Age (SPA). It is currently 66, rising to 67 between 2026-2028, and 68 thereafter."
            />
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[66, 67, 68].map((spa) => (
              <button
                key={spa}
                type="button"
                onClick={() => onProfileChange({ statePensionAge: spa })}
                className={`py-2.5 text-xs font-bold rounded-xl border transition-all min-h-[42px] ${
                  profile.statePensionAge === spa
                    ? 'border-nhs-blue bg-blue-50 text-nhs-blue ring-1 ring-blue-500'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Age {spa}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Special Class Status (SCS) Option */}
      <div className={`p-4 rounded-xl border transition-all ${
        profile.hasSpecialClassStatus 
          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <Shield className={`w-5 h-5 shrink-0 mt-0.5 ${profile.hasSpecialClassStatus ? 'text-amber-600' : 'text-slate-400'}`} />
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Special Class Status (SCS)
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  1995 Section
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Applies to female registered nurses and midwives who joined the NHS Pension Scheme prior to <strong>6 March 1995</strong> without a 5-year break. Normal Pension Age is <strong>55</strong> with zero early reduction!
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={profile.hasSpecialClassStatus}
              onChange={(e) => onProfileChange({ hasSpecialClassStatus: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      </div>

    </div>
  );
};
