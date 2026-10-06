import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { CareerPeriod } from '../../types/afc';
import { ScheduleConfig } from '../../types/schedule';
import { PensionProfile } from '../../types/pension';
import { calculateFullProjection } from '../../engine/calculatorEngine';
import { TrendingUp, BarChart2, Table as TableIcon, LineChart } from 'lucide-react';

interface RetirementAgeChartProps {
  careerPeriods: CareerPeriod[];
  schedule: ScheduleConfig;
  profile: PensionProfile;
}

export const RetirementAgeChart: React.FC<RetirementAgeChartProps> = ({
  careerPeriods,
  schedule,
  profile,
}) => {
  const [chartMode, setChartMode] = useState<'area' | 'bar' | 'table'>('area');

  const chartData = useMemo(() => {
    const data: Array<{
      age: number;
      netMonthlyPension: number;
      grossAnnualPension: number;
      taxFreeLumpSum: number;
    }> = [];

    // Calculate projection for each retirement age from 55 to 68
    for (let testAge = 55; testAge <= 68; testAge++) {
      try {
        const testProfile: PensionProfile = {
          ...profile,
          targetRetirementAge: testAge,
        };
        const proj = calculateFullProjection(careerPeriods, schedule, testProfile);
        data.push({
          age: testAge,
          netMonthlyPension: proj.tax.netMonthlyPension,
          grossAnnualPension: proj.finalGrossAnnualPension,
          taxFreeLumpSum: proj.finalTaxFreeLumpSum,
        });
      } catch (e) {
        // skip if invalid
      }
    }

    return data;
  }, [careerPeriods, schedule, profile]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-sm space-y-4 w-full">
      
      {/* Header with View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-nhs-blue shrink-0" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              Retirement Age Impact Analysis (Ages 55 to 68)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare take-home pension across early, normal, and late retirement options
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            type="button"
            onClick={() => setChartMode('area')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
              chartMode === 'area'
                ? 'bg-white text-nhs-blue shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Curve</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('bar')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
              chartMode === 'bar'
                ? 'bg-white text-nhs-blue shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Bars</span>
          </button>
          <button
            type="button"
            onClick={() => setChartMode('table')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
              chartMode === 'table'
                ? 'bg-white text-nhs-blue shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Trajectory Curve View */}
      {chartMode === 'area' && (
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#005EB8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#005EB8" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              
              <XAxis
                dataKey="age"
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `Age ${val}`}
              />
              
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `£${val}`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const isSelected = item.age === profile.targetRetirementAge;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[200px]">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-700">
                          <span className="font-bold text-sky-300">Retirement at Age {label}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-slate-200">
                          Net Take-Home: <strong className="text-white text-sm">£{item.netMonthlyPension.toLocaleString()}/mo</strong>
                        </p>
                        <p className="text-slate-200">
                          Gross Annual: <strong className="text-white">£{item.grossAnnualPension.toLocaleString()}/yr</strong>
                        </p>
                        <p className="text-emerald-400">
                          Tax-Free Lump Sum: <strong className="text-white">£{item.taxFreeLumpSum.toLocaleString()}</strong>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Highlight Selected Retirement Age */}
              <ReferenceLine
                x={profile.targetRetirementAge}
                stroke="#005EB8"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: `Age ${profile.targetRetirementAge} (Current)`,
                  position: 'top',
                  fill: '#005EB8',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              />

              <Area
                type="monotone"
                dataKey="netMonthlyPension"
                name="Net Monthly Pension (£/mo)"
                stroke="#005EB8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#blueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Comparison View */}
      {chartMode === 'bar' && (
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              
              <XAxis
                dataKey="age"
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `${val}`}
              />
              
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `£${val}`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                        <p className="font-bold text-sky-300">Age {label}</p>
                        <p className="text-white">
                          Net Monthly: <strong>£{item.netMonthlyPension.toLocaleString()}/mo</strong>
                        </p>
                        <p className="text-emerald-400">
                          Tax-Free Lump Sum: <strong>£{item.taxFreeLumpSum.toLocaleString()}</strong>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <ReferenceLine
                x={profile.targetRetirementAge}
                stroke="#005EB8"
                strokeWidth={2}
                strokeDasharray="3 3"
              />

              <Bar
                dataKey="netMonthlyPension"
                name="Net Monthly (£/mo)"
                fill="#005EB8"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Milestone Comparison Table View */}
      {chartMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 sm:px-4">Retirement Age</th>
                <th className="py-3 px-3 sm:px-4">Net Monthly Pension</th>
                <th className="py-3 px-3 sm:px-4">Gross Annual Pension</th>
                <th className="py-3 px-3 sm:px-4">Tax-Free Lump Sum</th>
                <th className="py-3 px-3 sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.map((row) => {
                const isSelected = row.age === profile.targetRetirementAge;
                return (
                  <tr
                    key={row.age}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 font-bold text-nhs-darkBlue'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 sm:px-4 font-extrabold flex items-center space-x-1.5">
                      <span>Age {row.age}</span>
                      {isSelected && (
                        <span className="text-[10px] bg-nhs-blue text-white px-2 py-0.5 rounded-full uppercase font-black">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 font-black text-nhs-blue">
                      £{row.netMonthlyPension.toLocaleString()}/mo
                    </td>
                    <td className="py-2.5 px-3 sm:px-4">
                      £{row.grossAnnualPension.toLocaleString()}/yr
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-emerald-700 font-semibold">
                      £{row.taxFreeLumpSum.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-[11px] text-slate-500">
                      {row.age === 55 && profile.hasSpecialClassStatus
                        ? '⭐ Unreduced SCS'
                        : row.age < 60
                        ? 'Early Reduction'
                        : row.age >= profile.statePensionAge
                        ? 'Unreduced SPA'
                        : 'Standard'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
