import { SchemeAccrualBreakdown } from '../types/pension';
import { get1995ActuarialFactor } from '../data/actuarialTables';

export interface Pension1995Input {
  serviceYears: number;
  addedYears?: number;
  finalPensionablePay: number;
  retirementAge: number;
  hasSpecialClassStatus: boolean;
}

/**
 * Calculates 1995 Section pension benefits.
 * Accrual: 1/80th final pay + 3/80ths lump sum
 * NPA: 60 (or 55 for Special Class female nurses/midwives)
 */
export function calculate1995Pension(input: Pension1995Input): SchemeAccrualBreakdown {
  const totalReckonableYears = Math.max(0, input.serviceYears + (input.addedYears ?? 0));
  const normalPensionAge = input.hasSpecialClassStatus ? 55 : 60;
  
  // Unreduced standard entitlement
  const standardAnnualPension = Math.round((input.finalPensionablePay * totalReckonableYears) / 80);
  const standardAutomaticLumpSum = Math.round(standardAnnualPension * 3);

  // Early retirement reduction
  const yearsEarly = Math.max(0, normalPensionAge - input.retirementAge);
  const { pensionFactor, lumpSumFactor } = get1995ActuarialFactor(yearsEarly);

  const reducedGrossAnnualPension = Math.round(standardAnnualPension * pensionFactor);
  const reducedLumpSum = Math.round(standardAutomaticLumpSum * lumpSumFactor);
  const actuarialReductionPercent = Math.round((1 - pensionFactor) * 1000) / 10;

  return {
    scheme: '1995',
    label: input.hasSpecialClassStatus 
      ? '1995 Section (Special Class Status - NPA 55)' 
      : '1995 Section (Final Salary 1/80th - NPA 60)',
    serviceYears: totalReckonableYears,
    normalPensionAge,
    grossAnnualPension: standardAnnualPension,
    automaticLumpSum: standardAutomaticLumpSum,
    actuarialReductionPercent,
    reducedGrossAnnualPension,
    reducedLumpSum,
  };
}

