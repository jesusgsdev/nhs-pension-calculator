import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'amber' | 'purple';
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  badge,
  badgeColor = 'blue',
  icon,
  highlight = false,
}) => {
  const badgeClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div
      className={`rounded-2xl p-3.5 sm:p-5 lg:p-6 border transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[135px] ${
        highlight
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50/70 border-blue-300 shadow-sm ring-2 ring-blue-500/15'
          : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide leading-tight line-clamp-1 sm:line-clamp-none">
            {label}
          </span>
          <div className="flex items-center space-x-1 shrink-0">
            {badge && (
              <span
                className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border whitespace-nowrap ${badgeClasses[badgeColor]}`}
              >
                {badge}
              </span>
            )}
            {icon && <div className="text-slate-400 hidden sm:block">{icon}</div>}
          </div>
        </div>

        <div className="flex items-baseline space-x-1 sm:space-x-2">
          <span
            className={`text-lg sm:text-2xl lg:text-3xl font-black tracking-tight ${
              highlight ? 'text-nhs-darkBlue' : 'text-slate-900'
            }`}
          >
            {value}
          </span>
        </div>
      </div>

      {subtitle && (
        <p className="mt-1.5 text-[10px] sm:text-xs text-slate-500 font-medium leading-tight line-clamp-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
