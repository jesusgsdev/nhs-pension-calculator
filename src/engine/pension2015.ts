import { SchemeAccrualBreakdown } from '../types/pension';
import { get2015ActuarialFactor } from '../data/actuarialTables';

export interface YearEarnings {
  calendarYear: number;
  pensionablePay: number;
}

export interface Pension2015Input {
  earningsHistory: YearEarnings[];
  statePensionAge: number;
  retirementAge: number;
  errboYearsBought: 0 | 1 | 2 | 3;
  // Assumed inflation rate for compounding (standard treasury/CPI expectation, default 2.0%)
  assumedCpiPercent?: number;
}

/**
 * Calculates 2015 CARE Scheme benefits.
 * Accrual: 1/54th of pensionable pay each year.
 * In-service revaluation: CPI + 1.5% compounded annually until retirement.
 * NPA: State Pension Age (adjusted by ERRBO down to min age 65).
 */
export function calculate2015Pension(input: Pension2015Input): SchemeAccrualBreakdown {
  const cpi = (input.assumedCpiPercent ?? 2.0) / 100;
  const annualRevaluationRate = 1 + cpi + 0.015; // CPI + 1.5%

  const totalYears = input.earningsHistory.length;
  let revaluedTotalPension = 0;

  // Accrue 1/54th for each year, compounded to retirement
  input.earningsHistory.forEach((item, index) => {
    const rawAccrual = item.pensionablePay / 54;
    // Years of revaluation remaining until retirement
    const yearsToCompound = Math.max(0, totalYears - index - 1);
    const compoundFactor = Math.pow(annualRevaluationRate, yearsToCompound);
    revaluedTotalPension += rawAccrual * compoundFactor;
  });

  const unreducedAnnualPension = Math.round(revaluedTotalPension);

  // Effective NPA accounting for ERRBO buyout (cannot reduce below 65)
  const effectiveNPA = Math.max(65, input.statePensionAge - input.errboYearsBought);

  // Years difference for actuarial reduction or enhancement
  const yearsDifference = effectiveNPA - input.retirementAge;
  const factor = get2015ActuarialFactor(yearsDifference);

  const reducedGrossAnnualPension = Math.round(unreducedAnnualPension * factor);
  const actuarialReductionPercent = yearsDifference > 0 
    ? Math.round((1 - factor) * 1000) / 10 
    : 0;

  return {
    scheme: '2015',
    label: input.errboYearsBought > 0
      ? `2015 Scheme (CARE 1/54th with ${input.errboYearsBought}yr ERRBO - NPA ${effectiveNPA})`
      : `2015 Scheme (CARE 1/54th - NPA ${effectiveNPA})`,
    serviceYears: totalYears,
    normalPensionAge: effectiveNPA,
    grossAnnualPension: unreducedAnnualPension,
    automaticLumpSum: 0,
    actuarialReductionPercent,
    reducedGrossAnnualPension,
    reducedLumpSum: 0,
    revaluationTotal: unreducedAnnualPension,
  };
}

