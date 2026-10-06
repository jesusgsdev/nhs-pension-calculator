import { SchemeAccrualBreakdown } from '../types/pension';
import { get2015ActuarialFactor } from '../data/actuarialTables';

export interface Pension2008Input {
  serviceYears: number;
  finalPensionablePay: number;
  retirementAge: number;
}

/**
 * Calculates 2008 Section pension benefits.
 * Accrual: 1/60th final pay
 * NPA: 65
 * Automatic Lump sum: None (available via commutation)
 */
export function calculate2008Pension(input: Pension2008Input): SchemeAccrualBreakdown {
  const normalPensionAge = 65;
  const standardAnnualPension = Math.round((input.finalPensionablePay * Math.max(0, input.serviceYears)) / 60);

  // Early/Late adjustment factor
  const yearsDifference = normalPensionAge - input.retirementAge;
  const factor = get2015ActuarialFactor(yearsDifference);

  const reducedGrossAnnualPension = Math.round(standardAnnualPension * factor);
  const actuarialReductionPercent = yearsDifference > 0 
    ? Math.round((1 - factor) * 1000) / 10 
    : 0;

  return {
    scheme: '2008',
    label: '2008 Section (Final Salary 1/60th - NPA 65)',
    serviceYears: input.serviceYears,
    normalPensionAge,
    grossAnnualPension: standardAnnualPension,
    automaticLumpSum: 0,
    actuarialReductionPercent,
    reducedGrossAnnualPension,
    reducedLumpSum: 0,
  };
}

