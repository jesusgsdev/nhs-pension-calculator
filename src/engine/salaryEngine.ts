import { AfCBand, PayStep, HCASLocation } from '../types/afc';
import { ScheduleConfig, ShiftCalculationResult } from '../types/schedule';
import { AFC_PAY_SCALES_2024 } from '../data/afcPayScales';
import { calculateHCAS } from '../data/hcasRates';
import { getPensionContributionRate } from '../data/taxBrackets';

export const NHS_STANDARD_FULL_TIME_HOURS = 37.5;
export const WEEKS_PER_YEAR = 52.143;
export const ANNUAL_FULL_TIME_HOURS = NHS_STANDARD_FULL_TIME_HOURS * WEEKS_PER_YEAR; // ~1955.36 hours

/**
 * Returns the basic full-time annual pay for an Agenda for Change band and step.
 */
export function getBasicBandPay(band: AfCBand, step: PayStep): number {
  const bandData = AFC_PAY_SCALES_2024[band];
  if (!bandData) return 29970; // fallback to Band 5 entry

  if (step === 'entry') return bandData.entry;
  if (step === 'intermediate') return bandData.intermediate ?? bandData.entry;
  return bandData.top;
}

/**
 * Calculates complete salary, unsocial enhancements, HCAS, and pensionable pay.
 */
export function calculateSalaryAndShifts(
  band: AfCBand,
  step: PayStep,
  hcasLocation: HCASLocation,
  schedule: ScheduleConfig,
  customHcasPercent?: number
): ShiftCalculationResult {
  const fte = Math.min(Math.max(schedule.contractedHoursPerWeek / NHS_STANDARD_FULL_TIME_HOURS, 0.1), 1.5);
  const fullTimeBasicPay = getBasicBandPay(band, step);
  const actualBasicPay = Math.round(fullTimeBasicPay * fte);

  // Hourly basic rate (based on full-time standard)
  const basicHourlyRate = fullTimeBasicPay / ANNUAL_FULL_TIME_HOURS;

  // HCAS London Weighting (pro-rated by FTE)
  const fullTimeHcas = calculateHCAS(fullTimeBasicPay, hcasLocation, customHcasPercent);
  const actualHcas = Math.round(fullTimeHcas * fte);

  // Unsocial Hours (Agenda for Change Section 2)
  // Annual contracted hours worked by this employee
  const annualContractedHours = schedule.contractedHoursPerWeek * WEEKS_PER_YEAR;

  // Nights & Saturdays (+30% enhancement for Band 4-9)
  const nightSatHours = annualContractedHours * (schedule.nightAndSaturdayPercentage / 100);
  const nightSaturdayEnhancementRate = 0.30; // standard Band 4-9 rate
  const nightSaturdayEnhancementPay = Math.round(nightSatHours * basicHourlyRate * nightSaturdayEnhancementRate);

  // Sundays & Bank Holidays (+60% enhancement for Band 4-9)
  const sundayBhHours = annualContractedHours * (schedule.sundayAndBankHolidayPercentage / 100);
  const sundayBhEnhancementRate = 0.60; // standard Band 4-9 rate
  const sundayBankHolidayEnhancementPay = Math.round(sundayBhHours * basicHourlyRate * sundayBhEnhancementRate);

  const totalUnsocialPay = nightSaturdayEnhancementPay + sundayBankHolidayEnhancementPay;
  const totalGrossPay = actualBasicPay + actualHcas + totalUnsocialPay;

  // Pensionable Pay calculation
  // Basic pay and HCAS are always pensionable. Unsocial hours are pensionable if contractual.
  const totalPensionablePay = actualBasicPay + actualHcas + (schedule.isUnsocialHoursPensionable ? totalUnsocialPay : 0);

  // Employee pension contribution rate based on actual pensionable pay tier
  const employeePensionContributionRate = getPensionContributionRate(totalPensionablePay);
  const annualEmployeePensionContribution = Math.round(totalPensionablePay * (employeePensionContributionRate / 100));
  const monthlyEmployeePensionContribution = Math.round(annualEmployeePensionContribution / 12);

  return {
    fte,
    basicHourlyRate: Number(basicHourlyRate.toFixed(2)),
    basicAnnualPay: actualBasicPay,
    hcasAnnualPay: actualHcas,
    nightSaturdayEnhancementPay,
    sundayBankHolidayEnhancementPay,
    totalUnsocialPay,
    totalGrossPay,
    totalPensionablePay,
    employeePensionContributionRate,
    annualEmployeePensionContribution,
    monthlyEmployeePensionContribution,
  };
}

