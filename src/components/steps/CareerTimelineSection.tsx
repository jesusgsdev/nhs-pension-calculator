import React from 'react';
import { CareerPeriod, AfCBand, PayStep, HCASLocation, RoleType } from '../../types/afc';
import { AFC_PAY_SCALES_2025, CAREER_PRESETS, ROLE_SAMPLE_TITLES } from '../../data/afcPayScales';
import { InfoTooltip } from '../common/InfoTooltip';
import { Plus, Trash2, History, Clock, MapPin, Award } from 'lucide-react';

interface CareerTimelineSectionProps {
  role: RoleType;
  periods: CareerPeriod[];
  onAddPeriod: () => void;
  onUpdatePeriod: (id: string, updates: Partial<CareerPeriod>) => void;
  onRemovePeriod: (id: string) => void;
  onLoadPreset: (index: number) => void;
}

const BANDS: AfCBand[] = [
  'Band 5',
  'Band 6',
  'Band 7',
  'Band 8a',
  'Band 8b',
  'Band 8c',
  'Band 8d',
  'Band 9',
];

const HCAS_OPTIONS: Array<{ value: HCASLocation; label: string; desc: string }> = [
  { value: 'national', label: 'National (Standard)', desc: 'Outside London/Fringe' },
  { value: 'inner_london', label: 'Inner London (+20%)', desc: 'Min £5,138, Max £8,010' },
  { value: 'outer_london', label: 'Outer London (+15%)', desc: 'Min £4,313, Max £5,436' },
  { value: 'fringe', label: 'Fringe Zone (+5%)', desc: 'Min £1,192, Max £2,011' },
  { value: 'custom', label: 'Custom Percentage', desc: 'User-specified %' },
];

export const CareerTimelineSection: React.FC<CareerTimelineSectionProps> = ({
  role,
  periods,
  onAddPeriod,
  onUpdatePeriod,
  onRemovePeriod,
  onLoadPreset,
}) => {
  const presets = CAREER_PRESETS[role];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-sm space-y-5 sm:space-y-6">
      
      {/* Header & Quick Templates */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
            2. Career History & Band Progression
            <InfoTooltip
              title="Career Progression Matters"
              content="In final salary schemes (1995 & 2008), promotions to higher bands like Band 7 or Band 8 uplift the value of ALL your earlier years of service! In the 2015 CARE scheme, each year builds pension based on that year's earnings."
            />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure each stage of your career across Agenda for Change bands, pay steps, and location weightings.
          </p>
        </div>

        {/* Quick Career Presets with horizontal scroll on mobile */}
        <div className="flex items-center space-x-2 pt-1">
          <div className="flex items-center space-x-1 text-xs font-bold text-slate-500 shrink-0">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Templates:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap no-scrollbar">
            {presets.map((preset, idx) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onLoadPreset(idx)}
                className="text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-nhs-blue border border-slate-200 transition-colors whitespace-nowrap shrink-0 min-h-[34px]"
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Career Periods List */}
      <div className="space-y-4 sm:space-y-5">
        {periods.map((period, index) => {
          const bandData = AFC_PAY_SCALES_2025[period.band];
          const isLatest = index === periods.length - 1;
          const roleTitle = period.roleTitle || ROLE_SAMPLE_TITLES[role][period.band];

          return (
            <div
              key={period.id}
              className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
                isLatest
                  ? 'bg-blue-50/40 border-blue-200 shadow-sm ring-1 ring-blue-500/20'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Period Header */}
              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-slate-200/70">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-nhs-blue text-white text-xs font-extrabold flex items-center justify-center shadow-sm shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                        Period {index + 1}: {period.band}
                      </span>
                      {isLatest && (
                        <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white shrink-0">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {roleTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hidden xs:inline-block">
                    {period.startCalendarYear}–{period.endCalendarYear} ({period.startAge}–{period.endAge}y)
                  </span>
                  {periods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemovePeriod(period.id)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Remove this career period"
                      aria-label="Remove period"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2-Column Responsive Form Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                
                {/* Column 1: Band & Step Point */}
                <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  
                  {/* AfC Band */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                      <Award className="w-3.5 h-3.5 text-nhs-blue mr-1 shrink-0" />
                      <span>Agenda for Change Band</span>
                    </label>
                    <select
                      value={period.band}
                      onChange={(e) => {
                        const newBand = e.target.value as AfCBand;
                        const title = ROLE_SAMPLE_TITLES[role][newBand] || 'Clinical Staff';
                        onUpdatePeriod(period.id, { band: newBand, roleTitle: title });
                      }}
                      className="w-full text-base sm:text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nhs-blue text-slate-800"
                    >
                      {BANDS.map((b) => (
                        <option key={b} value={b}>
                          {b} — {ROLE_SAMPLE_TITLES[role][b]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step Point */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                      <span>Pay Step Point</span>
                      <InfoTooltip
                        title="Agenda for Change Pay Steps"
                        content="Staff advance from Entry (<2 years) to Intermediate (2–4/5 years), and to Top of Band (4+ or 5+ years). Top of band awards the maximum basic salary for that band."
                      />
                    </label>
                    <select
                      value={period.step}
                      onChange={(e) => onUpdatePeriod(period.id, { step: e.target.value as PayStep })}
                      className="w-full text-base sm:text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nhs-blue text-slate-800"
                    >
                      <option value="entry">{bandData.stepLabels.entry}</option>
                      {bandData.intermediate && (
                        <option value="intermediate">{bandData.stepLabels.intermediate}</option>
                      )}
                      <option value="top">{bandData.stepLabels.top}</option>
                    </select>
                  </div>

                </div>

                {/* Column 2: Location (HCAS) & Working Hours */}
                <div className="space-y-3 sm:space-y-4 bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs">
                  
                  {/* Location / HCAS */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-nhs-blue mr-1 shrink-0" />
                      <span>Location / HCAS</span>
                      <InfoTooltip
                        title="High Cost Area Supplement (HCAS)"
                        content="Inner London is 20% of basic pay (min £5,138, max £8,010). Outer London is 15% (min £4,313, max £5,436). Fringe is 5% (min £1,192, max £2,011)."
                      />
                    </label>
                    <select
                      value={period.hcasLocation}
                      onChange={(e) => onUpdatePeriod(period.id, { hcasLocation: e.target.value as HCASLocation })}
                      className="w-full text-base sm:text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nhs-blue text-slate-800"
                    >
                      {HCAS_OPTIONS.map((h) => (
                        <option key={h.value} value={h.value}>
                          {h.label} ({h.desc})
                        </option>
                      ))}
                    </select>

                    {period.hcasLocation === 'custom' && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-slate-600 font-medium">Custom %:</span>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={period.customHcasPercentage ?? 20}
                          onChange={(e) => onUpdatePeriod(period.id, { customHcasPercentage: Number(e.target.value) })}
                          className="w-20 text-base sm:text-xs font-bold px-2 py-1 rounded-lg border border-slate-200"
                        />
                        <span className="text-xs text-slate-500 font-bold">%</span>
                      </div>
                    )}
                  </div>

                  {/* Contracted Hours / FTE */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
                      <Clock className="w-3.5 h-3.5 text-nhs-blue mr-1 shrink-0" />
                      <span>Working Hours / FTE</span>
                    </label>
                    <select
                      value={period.partTimeFte}
                      onChange={(e) => onUpdatePeriod(period.id, { partTimeFte: Number(e.target.value) })}
                      className="w-full text-base sm:text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nhs-blue text-slate-800"
                    >
                      <option value="1.0">1.0 WTE (Full-time: 37.5h)</option>
                      <option value="0.8">0.8 WTE (Part-time: 30.0h)</option>
                      <option value="0.6">0.6 WTE (Part-time: 22.5h)</option>
                      <option value="0.5">0.5 WTE (Part-time: 18.75h)</option>
                      <option value="0.4">0.4 WTE (Part-time: 15.0h)</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Bottom Row: Duration Touch Stepper */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center justify-between sm:justify-start space-x-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Duration:
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onUpdatePeriod(period.id, { yearsInPeriod: Math.max(1, period.yearsInPeriod - 1) })}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold text-lg flex items-center justify-center touch-manipulation shadow-xs"
                      aria-label="Decrease years"
                    >
                      -
                    </button>
                    <span className="text-sm font-extrabold text-nhs-darkBlue px-3 min-w-[70px] text-center">
                      {period.yearsInPeriod} {period.yearsInPeriod === 1 ? 'Year' : 'Years'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdatePeriod(period.id, { yearsInPeriod: Math.min(35, period.yearsInPeriod + 1) })}
                      className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-bold text-lg flex items-center justify-center touch-manipulation shadow-xs"
                      aria-label="Increase years"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Reckonable pension service: <strong>{period.yearsInPeriod * period.partTimeFte} years</strong>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Period Button */}
      <button
        type="button"
        onClick={onAddPeriod}
        className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-nhs-blue hover:bg-blue-50/50 text-slate-600 hover:text-nhs-blue text-xs font-bold flex items-center justify-center space-x-2 transition-all focus:outline-none min-h-[44px]"
      >
        <Plus className="w-4 h-4" />
        <span>Add Next Career Stage / Promotional Banding</span>
      </button>

    </div>
  );
};
