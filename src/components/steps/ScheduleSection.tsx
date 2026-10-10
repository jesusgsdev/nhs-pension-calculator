import React from 'react';
import { ScheduleConfig, ShiftPatternType } from '../../types/schedule';
import { InfoTooltip } from '../common/InfoTooltip';

interface ScheduleSectionProps {
  schedule: ScheduleConfig;
  onScheduleChange: (updates: Partial<ScheduleConfig>) => void;
}

const SHIFT_PATTERNS: Array<{
  type: ShiftPatternType;
  title: string;
  badge: string;
  hours: number;
  shiftLen: number;
  breakMin: number;
  nightSatPercent: number;
  sundayBhPercent: number;
  description: string;
}> = [
  {
    type: 'regular_37_5',
    title: 'Regular Hours (Day Shift)',
    badge: 'Standard 8am–4pm',
    hours: 37.5,
    shiftLen: 7.5,
    breakMin: 30,
    nightSatPercent: 0,
    sundayBhPercent: 0,
    description: '5 days a week, 7.5 hours paid per day (e.g. 08:00 to 16:00 with 30-min unpaid break). Standard daytime clinic/management rota.',
  },
  {
    type: 'rotational_11_5',
    title: 'Rotational 11.5h Long Shifts',
    badge: 'Ward / Inpatient Rota',
    hours: 37.5,
    shiftLen: 11.5,
    breakMin: 30,
    nightSatPercent: 25,
    sundayBhPercent: 12,
    description: 'Ward rota with mixture of 11.5h day shifts (8am–8pm) and night shifts (8pm–8am) with 30m break. Includes +30% & +60% enhancements.',
  },
  {
    type: 'night_shifts_only',
    title: 'Permanent Night Rota (11.5h)',
    badge: '8pm–8am Dedicated',
    hours: 37.5,
    shiftLen: 11.5,
    breakMin: 30,
    nightSatPercent: 70,
    sundayBhPercent: 15,
    description: 'Dedicated night duty (20:00 to 08:00). Highest Section 2 unsocial hours enhancement rate (+30% on unsocial hours).',
  },
  {
    type: 'compressed_hours',
    title: 'Compressed Working Hours',
    badge: '4-day Week',
    hours: 37.5,
    shiftLen: 9.375,
    breakMin: 30,
    nightSatPercent: 0,
    sundayBhPercent: 0,
    description: 'Full-time 37.5 hours completed across 4 longer days instead of 5 days (e.g. four 9.375-hour days).',
  },
  {
    type: 'custom',
    title: 'Custom Rota / Part-Time Hours',
    badge: 'Flexible Rota',
    hours: 30.0,
    shiftLen: 7.5,
    breakMin: 30,
    nightSatPercent: 15,
    sundayBhPercent: 10,
    description: 'Customize contracted hours, shift length, unpaid breaks, and exact unsocial hours breakdown.',
  },
];

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  schedule,
  onScheduleChange,
}) => {
  const handleSelectPattern = (pattern: typeof SHIFT_PATTERNS[0]) => {
    onScheduleChange({
      patternType: pattern.type,
      contractedHoursPerWeek: pattern.hours,
      shiftLengthHours: pattern.shiftLen,
      breakMinutes: pattern.breakMin,
      nightAndSaturdayPercentage: pattern.nightSatPercent,
      sundayAndBankHolidayPercentage: pattern.sundayBhPercent,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
          3. Working Patterns & Shift Rotas
          <InfoTooltip
            title="Shift Enhancements & Pensions"
            content="Under Agenda for Change Section 2, payments for working unsocial hours (nights, Saturdays, Sundays, bank holidays) ARE pensionable! They boost your annual pensionable pay and build higher pension accrual."
          />
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Select standard regular 8–4 hours, rotational 11.5-hour long shifts, compressed hours, or custom rota.
        </p>
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {SHIFT_PATTERNS.map((pat) => {
          const isSelected = schedule.patternType === pat.type;

          return (
            <div
              key={pat.type}
              onClick={() => handleSelectPattern(pat)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-nhs-blue bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900">{pat.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    isSelected ? 'bg-nhs-blue text-white border-nhs-blue' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {pat.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {pat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Sliders & Rota Customization */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Shift Details & Unsocial Enhancements (Section 2 AfC)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Contracted: <strong>{schedule.contractedHoursPerWeek} hrs/week</strong> (Whole-Time Equivalent: {(schedule.contractedHoursPerWeek / 37.5).toFixed(2)})
          </span>
        </div>

        {/* 3-Column Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Hours per week */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contracted Hours / Week
            </label>
            <input
              type="number"
              step="0.5"
              min="10"
              max="48"
              value={schedule.contractedHoursPerWeek}
              onChange={(e) => onScheduleChange({ contractedHoursPerWeek: Number(e.target.value) })}
              className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-nhs-blue"
            />
          </div>

          {/* Shift duration */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Shift Paid Duration
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="4"
                max="14"
                value={schedule.shiftLengthHours}
                onChange={(e) => onScheduleChange({ shiftLengthHours: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-nhs-blue"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">hrs</span>
            </div>
          </div>

          {/* Unpaid break */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Unpaid Break
            </label>
            <div className="relative">
              <input
                type="number"
                step="15"
                min="0"
                max="90"
                value={schedule.breakMinutes}
                onChange={(e) => onScheduleChange({ breakMinutes: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-nhs-blue"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400 font-semibold">mins</span>
            </div>
          </div>

        </div>

        {/* Unsocial Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Nights & Saturdays */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Nights (20:00–06:00) & Saturdays (+30% pay)
              </span>
              <span className="text-xs font-extrabold text-nhs-blue bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {schedule.nightAndSaturdayPercentage}% of hours
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={schedule.nightAndSaturdayPercentage}
              onChange={(e) => onScheduleChange({ nightAndSaturdayPercentage: Number(e.target.value) })}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nhs-blue"
            />
          </div>

          {/* Sundays & Bank Holidays */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Sundays & Bank Holidays (+60% pay)
              </span>
              <span className="text-xs font-extrabold text-nhs-blue bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {schedule.sundayAndBankHolidayPercentage}% of hours
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={schedule.sundayAndBankHolidayPercentage}
              onChange={(e) => onScheduleChange({ sundayAndBankHolidayPercentage: Number(e.target.value) })}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nhs-blue"
            />
          </div>

        </div>

        {/* Pensionability Option */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold text-slate-800 flex items-center">
              Contractual Unsocial Hours are Pensionable
              <InfoTooltip
                title="Contractual vs Bank Overtime"
                content="Contractual unsocial hours under Section 2 are pensionable in NHS England. Extra non-contractual bank shifts are not pensionable."
              />
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Include night and weekend enhancements in annual pensionable pay
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input
              type="checkbox"
              checked={schedule.isUnsocialHoursPensionable}
              onChange={(e) => onScheduleChange({ isUnsocialHoursPensionable: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nhs-blue"></div>
          </label>
        </div>

      </div>

    </div>
  );
};
