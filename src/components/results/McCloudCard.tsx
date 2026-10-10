import React from 'react';
import { McCloudComparisonResult } from '../../types/pension';
import { InfoTooltip } from '../common/InfoTooltip';
import { Scale, CheckCircle2 } from 'lucide-react';

interface McCloudCardProps {
  mccloud: McCloudComparisonResult;
}

export const McCloudCard: React.FC<McCloudCardProps> = ({ mccloud }) => {
  if (!mccloud.eligibleForRemedy || mccloud.remedyYears <= 0) {
    return null;
  }

  const legacyIsBetter = mccloud.recommendedChoice === 'legacy';

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-nhs-blue" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center">
              The McCloud Remedy: Deferred Choice Underpin (DCU)
              <InfoTooltip
                title="Your Legal Choice at Retirement"
                content="Under the Public Service Pensions Remedy, eligible members choose between legacy and 2015 scheme benefits for the 7-year remedy window (1 April 2015 – 31 March 2022). This comparison shows the difference."
              />
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Service evaluated for remedy period: {mccloud.remedyYears} years (2015–2022)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Optimal: {legacyIsBetter ? mccloud.legacyOption.schemeName : '2015 CARE'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Option A: Legacy Scheme */}
        <div className={`p-4 rounded-xl border transition-all ${
          legacyIsBetter
            ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/20 shadow-xs'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">
              Option A: {mccloud.legacyOption.schemeName}
            </span>
            {legacyIsBetter && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                Recommended
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Annual Pension (Remedy Years):</span>
              <strong className="text-slate-900">£{mccloud.legacyOption.annualPension.toLocaleString()}/yr</strong>
            </div>
            <div className="flex justify-between">
              <span>Automatic Lump Sum:</span>
              <strong className="text-emerald-700">£{mccloud.legacyOption.lumpSum.toLocaleString()}</strong>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 leading-relaxed">
              Tied to your final pensionable pay at retirement. Includes automatic 3x tax-free lump sum if in 1995 section.
            </p>
          </div>
        </div>

        {/* Option B: 2015 CARE */}
        <div className={`p-4 rounded-xl border transition-all ${
          !legacyIsBetter
            ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/20 shadow-xs'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">
              Option B: 2015 CARE Scheme
            </span>
            {!legacyIsBetter && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                Recommended
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Annual Pension (Remedy Years):</span>
              <strong className="text-slate-900">£{mccloud.scheme2015Option.annualPension.toLocaleString()}/yr</strong>
            </div>
            <div className="flex justify-between">
              <span>Automatic Lump Sum:</span>
              <span className="text-slate-500">£0 (Commutation only)</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 leading-relaxed">
              Accrues at 1/54th per year revalued by CPI + 1.5%. Beneficial if you remain in entry bands without large promotional steps.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
