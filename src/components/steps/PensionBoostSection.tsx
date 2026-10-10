import React from 'react';
import { PensionProfile } from '../../types/pension';
import { InfoTooltip } from '../common/InfoTooltip';
import { TrendingUp, Award, Zap, Scale } from 'lucide-react';

interface PensionBoostSectionProps {
  profile: PensionProfile;
  onProfileChange: (updates: Partial<PensionProfile>) => void;
}

export const PensionBoostSection: React.FC<PensionBoostSectionProps> = ({
  profile,
  onProfileChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
          4. Pension Policies & Boosting Options
          <InfoTooltip
            title="Ways to Boost NHS Pension"
            content="NHS Pension allows multiple booster mechanisms: ERRBO buys out early retirement reductions for the 2015 scheme; Additional Pension buys guaranteed inflation-linked annual income."
          />
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Select McCloud remedy preferences, ERRBO early retirement buy-outs, and Additional Pension options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* McCloud Remedy Choice */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-nhs-blue" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              McCloud Remedy (2015–2022 DCU)
            </span>
            <InfoTooltip
              title="Deferred Choice Underpin"
              content="If you joined on or before 31 March 2012 and worked between 1 April 2015 and 31 March 2022, you choose between your legacy scheme (1995 or 2008) or the 2015 CARE scheme for that 7-year remedy window."
            />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Which scheme benefits do you wish to test for the 7-year remedy window?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'optimal', label: 'Optimal Choice', desc: 'Auto-picks best' },
              { id: 'legacy', label: 'Legacy Section', desc: '1995/2008 Final Pay' },
              { id: '2015', label: '2015 CARE', desc: '1/54th Accrual' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onProfileChange({ mccloudChoice: opt.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  profile.mccloudChoice === opt.id
                    ? 'border-nhs-blue bg-blue-50/80 text-nhs-blue ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-extrabold">{opt.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ERRBO (Early Retirement Reduction Buy Out) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              ERRBO Buy-Out (2015 Scheme)
            </span>
            <InfoTooltip
              title="Early Retirement Reduction Buy Out"
              content="Under the 2015 Scheme, ERRBO lets members pay an extra contribution to buy out 1, 2, or 3 years of early retirement reduction, enabling unreduced retirement as early as age 65 (instead of SPA 67/68)."
            />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Years of early retirement reduction bought out (reduces NPA to minimum age 65):
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[0, 1, 2, 3].map((yrs) => (
              <button
                key={yrs}
                type="button"
                onClick={() => onProfileChange({ errboYearsBought: yrs as any })}
                className={`py-2.5 text-center rounded-xl border text-xs font-bold transition-all ${
                  profile.errboYearsBought === yrs
                    ? 'border-nhs-blue bg-blue-50/80 text-nhs-blue ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {yrs === 0 ? 'None (0 yrs)' : `${yrs} Year${yrs > 1 ? 's' : ''}`}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Additional Pension (AP) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Additional Pension (AP)
            </span>
            <InfoTooltip
              title="Purchasing Additional Pension"
              content="You can purchase Additional Pension in blocks of £250 up to £6,500+ per year. This is fully guaranteed and index-linked for life."
            />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Guaranteed annual pension purchased (in multiples of £250):
          </p>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">£</span>
            <input
              type="number"
              step="250"
              min="0"
              max="7000"
              value={profile.additionalPensionPurchased}
              onChange={(e) => onProfileChange({ additionalPensionPurchased: Number(e.target.value) })}
              className="w-full text-xs font-bold pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-nhs-blue"
              placeholder="0"
            />
          </div>
        </div>

        {/* Added Years (Historical 1995) */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Added Years (Legacy 1995)
              </span>
              <InfoTooltip
                title="Historical Added Years Contracts"
                content="Legacy contracts taken out before April 2008 allowed members in the 1995 Section to purchase additional 1/80th reckonable service years."
              />
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
              <input
                type="checkbox"
                checked={profile.hasAddedYears}
                onChange={(e) => onProfileChange({ hasAddedYears: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {profile.hasAddedYears && (
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Number of Added Years
              </label>
              <input
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                value={profile.addedYearsCount}
                onChange={(e) => onProfileChange({ addedYearsCount: Number(e.target.value) })}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-nhs-blue"
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
