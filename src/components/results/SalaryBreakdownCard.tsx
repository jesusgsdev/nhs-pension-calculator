import React from 'react';
import { ShiftCalculationResult, ScheduleConfig } from '../../types/schedule';
import { CareerPeriod } from '../../types/afc';
import { InfoTooltip } from '../common/InfoTooltip';

interface SalaryBreakdownCardProps {
  salary: ShiftCalculationResult;
  currentPeriod: CareerPeriod;
  schedule: ScheduleConfig;
}

export const SalaryBreakdownCard: React.FC<SalaryBreakdownCardProps> = ({
  salary,
  currentPeriod,
  schedule,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center">
            Current Pay & Pension Contributions
            <InfoTooltip
              title="Current Pay Architecture"
              content="Shows your current Agenda for Change pay breakdown including basic pay, London weighting (HCAS), Section 2 unsocial hours enhancements, and monthly NHS pension contributions."
            />
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentPeriod.band} ({currentPeriod.step} step) • {schedule.contractedHoursPerWeek} contracted hrs/week (FTE {salary.fte.toFixed(2)})
          </p>
        </div>

        <div className="text-left sm:text-right bg-blue-50/60 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-blue-100">
          <div className="text-xl sm:text-2xl font-black text-nhs-blue">
            £{salary.totalGrossPay.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">Total Gross Pay / Year</div>
        </div>
      </div>

      {/* Spacious 4-Column Full Width Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Basic Pay */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Basic Salary</span>
            <span className="text-xs text-slate-400 font-semibold">£{salary.basicHourlyRate.toFixed(2)}/hr</span>
          </div>
          <div className="text-lg font-black text-slate-900">
            £{salary.basicAnnualPay.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Agenda for Change 2024/25 rate
          </div>
        </div>

        {/* HCAS */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">London HCAS</span>
            <span className="text-xs text-nhs-blue font-semibold uppercase">{currentPeriod.hcasLocation.replace('_', ' ')}</span>
          </div>
          <div className="text-lg font-black text-slate-900">
            £{salary.hcasAnnualPay.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {salary.hcasAnnualPay > 0 ? 'High Cost Area Supplement' : 'No geographic supplement'}
          </div>
        </div>

        {/* Unsocial Hours Enhancements */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unsocial Hours (Sec 2)</span>
            <span className="text-xs text-emerald-600 font-semibold">+30% / +60%</span>
          </div>
          <div className="text-lg font-black text-slate-900">
            £{salary.totalUnsocialPay.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Nights: £{salary.nightSaturdayEnhancementPay.toLocaleString()} • Suns/BH: £{salary.sundayBankHolidayEnhancementPay.toLocaleString()}
          </div>
        </div>

        {/* Pension Contributions */}
        <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-nhs-blue">Pension Tier</span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-600 text-white">
              {salary.employeePensionContributionRate}%
            </span>
          </div>
          <div className="text-lg font-black text-nhs-darkBlue">
            £{salary.monthlyEmployeePensionContribution.toLocaleString()}/mo
          </div>
          <div className="text-xs text-slate-600 mt-1">
            £{salary.annualEmployeePensionContribution.toLocaleString()} annual deduction
          </div>
        </div>

      </div>

      {/* Pensionable Pay Summary */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="text-slate-600 font-medium">
          Total Pensionable Pay (used for final salary & CARE accrual):
        </span>
        <span className="font-extrabold text-slate-900 text-sm">
          £{salary.totalPensionablePay.toLocaleString()}/yr
        </span>
      </div>

    </div>
  );
};
