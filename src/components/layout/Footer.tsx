import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-16 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <span className="bg-nhs-blue text-white px-2 py-0.5 rounded text-xs font-black">NHS</span>
            <span>England Nurse & Midwife Pay & Pension Calculator</span>
          </div>

          <div className="flex flex-wrap gap-4 text-slate-400">
            <a
              href="https://www.nhsbsa.nhs.uk/nhs-pensions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>NHS BSA Pensions Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.nhsemployers.org/articles/pay-scales-202526"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>NHS Employers Pay Scales</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-start space-x-3 text-slate-400 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">Disclaimer:</strong> This tool provides estimates for informational and illustrative purposes based on published NHS Agenda for Change pay circulars, NHS Pension Scheme regulations (1995, 2008, 2015), the McCloud Remedy (Deferred Choice Underpin), and standard UK PAYE income tax brackets. It does not constitute formal financial, pension, or legal advice. Actual pension entitlements are formally calculated and verified by the NHS Business Services Authority (NHS BSA) upon receipt of member retirement application forms (AW8).
          </p>
        </div>

        <div className="text-center text-slate-500 pt-2">
          Built for NHS England Registered Nurses, Midwives, Sisters, Matrons & Clinical Leads.
        </div>
      </div>
    </footer>
  );
};

