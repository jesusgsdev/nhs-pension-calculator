import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

interface ExplanationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplanationsModal: React.FC<ExplanationsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'afc' | 'schemes' | 'mccloud' | 'shifts' | 'boost' | 'tax'>('afc');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-nhs-blue text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 shrink-0" />
            <h2 className="text-sm sm:text-lg font-bold leading-tight">
              NHS Nurse & Midwife Pay and Pension Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs (Horizontally Scrollable on Mobile) */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold text-slate-600 px-2 sm:px-4 no-scrollbar">
          {[
            { id: 'afc', label: 'Agenda for Change & HCAS' },
            { id: 'shifts', label: 'Shifts & Unsocial Pay' },
            { id: 'schemes', label: '1995 / 2008 / 2015 Schemes' },
            { id: 'mccloud', label: 'The McCloud Remedy' },
            { id: 'boost', label: 'ERRBO & Boosting' },
            { id: 'tax', label: 'Commutation & Tax' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 sm:px-4 border-b-2 whitespace-nowrap transition-all text-[11px] sm:text-xs shrink-0 ${
                activeTab === tab.id
                  ? 'border-nhs-blue text-nhs-blue bg-white font-extrabold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {activeTab === 'afc' && (
            <div className="space-y-3.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Agenda for Change (AfC) Pay Structure & High Cost Area Supplements
              </h3>
              <p>
                In NHS England, nurses and midwives are employed under the <strong>Agenda for Change (AfC)</strong> national pay system. Following the 2018 AfC pay reform, incremental pay spines were replaced with a streamlined 2-step or 3-step structure:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Entry Step:</strong> Paid upon appointment to the band (&lt; 2 years of experience).</li>
                <li><strong>Intermediate Step:</strong> Achieved after completing 2 years in post (for Bands 5, 6, and 7).</li>
                <li><strong>Top of Band:</strong> Reached after 4 years (Band 5) or 5 years (Bands 6 & 7), awarding the highest basic salary for that band.</li>
              </ul>

              <h4 className="font-bold text-slate-900 pt-2">High Cost Area Supplement (HCAS)</h4>
              <p>
                Staff in London and the commuter belt receive an additional percentage of basic salary, subject to statutory minimum and maximum caps (2025/26 figures):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-nhs-blue block">Inner London</strong>
                  <span>20% of basic pay</span>
                  <span className="block text-[11px] text-slate-500 mt-1">Min £5,323 • Max £8,085</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-nhs-blue block">Outer London</strong>
                  <span>15% of basic pay</span>
                  <span className="block text-[11px] text-slate-500 mt-1">Min £4,457 • Max £5,582</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong className="text-nhs-blue block">Fringe Zone</strong>
                  <span>5% of basic pay</span>
                  <span className="block text-[11px] text-slate-500 mt-1">Min £1,224 • Max £2,137</span>
                </div>
              </div>
              <p className="text-slate-600 text-xs italic">
                Crucially, HCAS payments are fully pensionable and boost both final salary calculations and CARE pension accrual.
              </p>
            </div>
          )}

          {activeTab === 'shifts' && (
            <div className="space-y-3.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Shift Patterns & Section 2 Unsocial Hours Enhancements
              </h3>
              <p>
                The standard full-time NHS contract is <strong>37.5 hours per week</strong> (Whole Time Equivalent = 1.0). Typical working schedules include:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Regular Hours:</strong> 5 days × 7.5 hours paid per day (e.g. 08:00 to 16:00 with a 30-minute unpaid meal break).</li>
                <li><strong>11.5-Hour Long Shifts:</strong> 12-hour elapsed time (e.g. 08:00 to 20:30 or 20:00 to 08:30) with 30–60 minutes unpaid break, totaling 11.5 hours paid. Full-time staff work ~13 shifts per 4-week roster.</li>
                <li><strong>Compressed Hours:</strong> Completing 37.5 contracted hours in 4 extended working days.</li>
              </ul>

              <h4 className="font-bold text-slate-900 pt-2">Agenda for Change Section 2 Unsocial Hours</h4>
              <p>
                Hours worked outside 06:00 to 20:00 Monday to Friday qualify for enhancements:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Nights (20:00–06:00) & Saturdays:</strong> +30% enhancement for Bands 4–9 (+47% for Bands 1–3).</li>
                <li><strong>Sundays & Public Holidays:</strong> +60% enhancement for Bands 4–9 (+94% for Bands 1–3).</li>
              </ul>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <strong>Pensionability Rule:</strong> Contractual unsocial hours under Section 2 are classified as <em>pensionable pay</em> in NHS England. Extra voluntary bank shifts beyond 37.5 hours are non-pensionable.
              </div>
            </div>
          )}

          {activeTab === 'schemes' && (
            <div className="space-y-3.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                NHS Pension Scheme Evolution Over the Last 30 Years
              </h3>
              <p>
                Over the last three decades, NHS England has operated three distinct pension schemes:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900">1. 1995 Section (Final Salary)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Accrual:</strong> 1/80th of final year pensionable pay per year of service.<br />
                    <strong>Lump Sum:</strong> Automatic tax-free lump sum of 3× annual pension (3/80ths per year).<br />
                    <strong>Normal Pension Age:</strong> 60 (or 55 for Special Class female nurses/midwives).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900">2. 2008 Section (Final Salary)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Accrual:</strong> 1/60th of reckonable pay (best of last 3 years).<br />
                    <strong>Lump Sum:</strong> No automatic lump sum (available by commutation at 12:1).<br />
                    <strong>Normal Pension Age:</strong> 65.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900">3. 2015 Scheme (CARE - Career Average Revalued Earnings)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong>Accrual:</strong> 1/54th of actual pensionable earnings in each scheme year.<br />
                    <strong>Revaluation:</strong> Banked pension is revalued every active year by Treasury Order (CPI + 1.5%).<br />
                    <strong>Normal Pension Age:</strong> Equal to UK State Pension Age (currently 66, rising to 67 and 68).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <strong>Special Class Status (SCS):</strong> Female nurses, midwives, and health visitors who joined prior to 6 March 1995 retain the right to retire at age 55 with 100% unreduced benefits under the 1995 Section.
              </div>
            </div>
          )}

          {activeTab === 'mccloud' && (
            <div className="space-y-3.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                The McCloud Remedy (Public Service Pensions Remedy)
              </h3>
              <p>
                When the government reformed public service pensions in 2015, transitional protection granted older members the right to remain in the 1995/2008 schemes while younger staff were moved to the 2015 scheme. In 2018, the Court of Appeal ruled this transitional protection unlawful age discrimination (the <em>McCloud</em> ruling).
              </p>
              
              <h4 className="font-bold text-slate-900 pt-2">The Deferred Choice Underpin (DCU)</h4>
              <p>
                From 1 October 2023, eligible members who were in service on or before <strong>31 March 2012</strong> and worked between <strong>1 April 2015 and 31 March 2022</strong> (the 7-year remedy period) receive a choice at retirement:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Option A (Legacy Benefits):</strong> Receive 1995 Section (1/80th + automatic 3x lump sum) or 2008 Section (1/60th) benefits for the 7 remedy years, tied to your final salary.</li>
                <li><strong>Option B (2015 CARE Benefits):</strong> Receive 2015 CARE scheme benefits (1/54th with CPI + 1.5% revaluation) for those 7 years.</li>
              </ul>
              <p className="text-xs text-slate-600">
                From 1 April 2022 onwards, all active NHS members accrue benefits exclusively in the 2015 CARE scheme.
              </p>
            </div>
          )}

          {activeTab === 'boost' && (
            <div className="space-y-3.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Boosting Your NHS Pension: ERRBO & Additional Pension
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900">1. ERRBO (Early Retirement Reduction Buy Out)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Available in the 2015 Scheme. Allows you to pay an extra contribution percentage (typically 1.5% to 3.5%) to buy out 1, 2, or 3 years of early retirement reduction. This allows retirement with unreduced benefits as early as age 65 (instead of State Pension Age 67/68).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900">2. Additional Pension (AP)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Allows members to buy guaranteed blocks of annual pension (in multiples of £250 up to ~£6,500/year). AP is fully index-linked to inflation for life.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="space-y-3.5">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Commutation (Cash Lump Sum) & UK Pension Taxation
              </h3>

              <h4 className="font-bold text-slate-900">12:1 Commutation Exchange Ratio</h4>
              <p>
                Under NHS scheme rules, members can surrender part of their annual taxable pension in exchange for a one-off tax-free cash lump sum at a rate of <strong>£12 lump sum per £1 of annual pension surrendered</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Under HMRC regulations, the maximum tax-free lump sum cannot exceed <strong>25% of the total capital value</strong> of your pension.</li>
                <li>The absolute UK lifetime tax-free cash limit is governed by the <strong>Lump Sum Allowance (LSA)</strong>, capped at <strong>£268,275</strong>.</li>
              </ul>

              <h4 className="font-bold text-slate-900 pt-2">How Pension Income Is Taxed (PAYE)</h4>
              <p>
                While the lump sum is 100% tax-free, your annual NHS pension is treated as taxable income under standard UK Income Tax bands:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Personal Allowance (£12,570):</strong> 0% tax on the first £12,570 of total income.</li>
                <li><strong>Basic Rate (20%):</strong> Applies to taxable income between £12,571 and £50,270.</li>
                <li><strong>Higher Rate (40%):</strong> Applies to income between £50,271 and £125,140.</li>
              </ul>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-nhs-blue text-white text-xs font-bold hover:bg-nhs-darkBlue transition-colors min-h-[40px]"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
