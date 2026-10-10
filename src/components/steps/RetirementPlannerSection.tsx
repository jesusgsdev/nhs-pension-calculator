import React from 'react';
import { PensionProfile, FullRetirementProjection } from '../../types/pension';
import { InfoTooltip } from '../common/InfoTooltip';
import { AlertCircle } from 'lucide-react';

interface RetirementPlannerSectionProps {
  profile: PensionProfile;
  onProfileChange: (updates: Partial<PensionProfile>) => void;
  projection: FullRetirementProjection | null;
}

export const RetirementPlannerSection: React.FC<RetirementPlannerSectionProps> = ({
  profile,
  onProfileChange,
  projection,
}) => {

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
          5. Retirement Age & Cash Commutation
          <InfoTooltip
            title="Timing Your Retirement"
            content="Retiring earlier than your Normal Pension Age applies actuarial reductions. Retiring later applies late enhancements. You can also surrender annual pension for a tax-free cash lump sum at 12:1."
          />
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Explore early vs. normal retirement ages and adjust your tax-free cash lump sum trade-off.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Retirement Age Slider */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              Planned Retirement Age
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-nhs-darkBlue">
                Age {profile.targetRetirementAge}
              </span>
              <span className="text-xs text-slate-500">
                ({Math.max(0, profile.targetRetirementAge - profile.currentAge)} yrs away)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="55"
            max="70"
            step="1"
            value={profile.targetRetirementAge}
            onChange={(e) => onProfileChange({ targetRetirementAge: Number(e.target.value) })}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nhs-blue"
          />

          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span>55 (Early / SCS)</span>
            <span>60 (1995 NPA)</span>
            <span>65 (2008 NPA)</span>
            <span>67 (2015 SPA)</span>
            <span>70 (Late)</span>
          </div>

          {/* Context Badge */}
          <div className="pt-2">
            {profile.hasSpecialClassStatus && profile.targetRetirementAge === 55 ? (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center space-x-2">
                <span>⭐ Special Class Status: 100% Unreduced 1995 pension available at age 55!</span>
              </div>
            ) : profile.targetRetirementAge < 60 ? (
              <div className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Early Retirement: Actuarial reduction factors will be applied to pre-NPA years.</span>
              </div>
            ) : profile.targetRetirementAge >= profile.statePensionAge ? (
              <div className="p-2.5 bg-blue-50 text-nhs-blue border border-blue-200 rounded-lg text-xs font-semibold">
                ✓ Full State Pension Age reached. 2015 Scheme benefits unreduced.
              </div>
            ) : null}
          </div>
        </div>

        {/* Lump Sum Commutation Slider */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center">
              Tax-Free Lump Sum (Commutation)
              <InfoTooltip
                title="12:1 Exchange Rate"
                content="Under NHS Pension rules, you can exchange £1 of annual taxable pension for £12 of tax-free cash, up to HMRC's 25% capital limit (£268,275 maximum)."
              />
            </span>
            <span className="text-sm font-black text-emerald-700">
              {profile.commutationPercentage}% of Max Cash
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={profile.commutationPercentage}
            onChange={(e) => onProfileChange({ commutationPercentage: Number(e.target.value) })}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex justify-between text-[10px] font-semibold text-slate-400">
            <span>0% (Max Monthly Pension)</span>
            <span>50%</span>
            <span>100% (Maximum Tax-Free Cash)</span>
          </div>

          {projection && projection.commutation.annualPensionSurrendered > 0 && (
            <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs leading-relaxed">
              Exchanging <strong>£{projection.commutation.annualPensionSurrendered.toLocaleString()}/yr</strong> pension for an additional <strong>+£{projection.commutation.additionalTaxFreeLumpSum.toLocaleString()}</strong> tax-free lump sum.
            </div>
          )}
        </div>

      </div>

      {/* State Pension Option */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-800">
            Factor in New UK State Pension (~£11,502/yr) into Tax Model
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            When you reach State Pension Age ({profile.statePensionAge}), the State Pension uses up £11,502 of your £12,570 tax-free personal allowance, increasing PAYE tax deducted from your NHS pension.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={profile.includeStatePensionInTax}
            onChange={(e) => onProfileChange({ includeStatePensionInTax: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nhs-blue"></div>
        </label>
      </div>

    </div>
  );
};
