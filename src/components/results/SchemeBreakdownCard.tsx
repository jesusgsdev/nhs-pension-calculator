import React from 'react';
import { FullRetirementProjection } from '../../types/pension';
import { InfoTooltip } from '../common/InfoTooltip';

interface SchemeBreakdownCardProps {
  projection: FullRetirementProjection;
}

export const SchemeBreakdownCard: React.FC<SchemeBreakdownCardProps> = ({ projection }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center">
            Multi-Scheme Benefit Breakdown
            <InfoTooltip
              title="Multi-Scheme Membership"
              content="Because you served across different pension eras, your pension combines entitlements from the 1995 Section, 2008 Section, and 2015 Scheme. Each section retains its own Normal Pension Age and rules."
            />
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total reckonable service: {projection.totalServiceYears} years • Planned retirement age: {projection.targetRetirementAge}
          </p>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-4">
        {projection.schemes.map((scheme, idx) => (
          <div
            key={`${scheme.scheme}-${idx}`}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
          >
            {/* Top row: Label & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900">{scheme.label}</span>
              
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-nhs-blue border border-blue-200">
                  {scheme.serviceYears} {scheme.serviceYears === 1 ? 'Year' : 'Years'} Service
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Normal Pension Age: {scheme.normalPensionAge}
                </span>
                {scheme.actuarialReductionPercent > 0 && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    -{scheme.actuarialReductionPercent}% Early Reduction
                  </span>
                )}
              </div>
            </div>

            {/* Values: 4 columns in Full Width */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-200/70">
              
              {/* Gross Annual Pension */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Annual Pension
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    £{Math.round(scheme.reducedGrossAnnualPension / 12).toLocaleString()}/mo
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-nhs-darkBlue">
                  £{scheme.reducedGrossAnnualPension.toLocaleString()}/year
                </div>
                {scheme.actuarialReductionPercent > 0 && (
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Reduced from £{scheme.grossAnnualPension.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Lump Sum */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Automatic Tax-Free Lump Sum
                </span>
                {scheme.automaticLumpSum > 0 ? (
                  <>
                    <div className="text-base sm:text-lg font-black text-emerald-700">
                      £{scheme.reducedLumpSum.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      3× annual pension entitlement
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-base sm:text-lg font-bold text-slate-400">
                      £0
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Available via 12:1 commutation
                    </span>
                  </>
                )}
              </div>

              {/* Standard vs Reduced comparison */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Unreduced Baseline
                </span>
                <div className="text-base sm:text-lg font-black text-slate-700">
                  £{scheme.grossAnnualPension.toLocaleString()}/year
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Entitlement at NPA {scheme.normalPensionAge}
                </span>
              </div>

              {/* Accrual Rate & Rules */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Scheme Formula
                </span>
                <div className="text-base sm:text-lg font-bold text-slate-800">
                  {scheme.scheme === '1995' ? '1/80th Final Pay' : scheme.scheme === '2008' ? '1/60th Final Pay' : '1/54th CARE'}
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {scheme.scheme === '2015' ? 'CPI + 1.5% compounding' : 'Final pensionable salary'}
                </span>
              </div>

            </div>

          </div>
        ))}

        {/* Additional Pension row */}
        {projection.additionalPensionBenefit > 0 && (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900 text-sm">
              Additional Pension (AP) Purchased:
            </span>
            <span className="font-extrabold text-emerald-800 text-base">
              +£{projection.additionalPensionBenefit.toLocaleString()}/yr
            </span>
          </div>
        )}

      </div>

    </div>
  );
};
