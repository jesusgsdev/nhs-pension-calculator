import { PensionTaxCalculation } from '../types/pension';
import { UK_TAX_RATES } from '../data/taxBrackets';

export interface TaxInput {
  grossAnnualPension: number;
  includeStatePension: boolean;
  statePensionAmount?: number;
}

/**
 * Calculates UK PAYE income tax on NHS pension benefits.
 */
export function calculatePensionTax(input: TaxInput): PensionTaxCalculation {
  const grossPension = Math.max(0, input.grossAnnualPension);
  const statePension = input.includeStatePension 
    ? (input.statePensionAmount ?? UK_TAX_RATES.standardNewStatePensionAnnual)
    : 0;
  
  const totalIncome = grossPension + statePension;

  // Calculate Personal Allowance with taper over £100k
  let personalAllowance = UK_TAX_RATES.personalAllowance;
  if (totalIncome > 100000) {
    const excess = totalIncome - 100000;
    const taper = Math.floor(excess / 2);
    personalAllowance = Math.max(0, personalAllowance - taper);
  }

  // State Pension consumes personal allowance first
  const remainingAllowanceForNhsPension = Math.max(0, personalAllowance - statePension);

  // Taxable NHS pension
  const taxablePensionIncome = Math.max(0, grossPension - remainingAllowanceForNhsPension);

  // Tax brackets relative to total income
  let basicRateTax = 0;
  let higherRateTax = 0;
  let additionalRateTax = 0;

  // We calculate tax on total income, then find tax attributable to NHS Pension
  if (totalIncome > personalAllowance) {
    const taxableTotal = totalIncome - personalAllowance;
    const basicBandSize = UK_TAX_RATES.basicRateLimit - personalAllowance;
    const higherBandSize = UK_TAX_RATES.higherRateLimit - UK_TAX_RATES.basicRateLimit;

    const inBasic = Math.min(taxableTotal, basicBandSize);
    const inHigher = Math.min(Math.max(0, taxableTotal - basicBandSize), higherBandSize);
    const inAdditional = Math.max(0, taxableTotal - basicBandSize - higherBandSize);

    // If state pension is included, state pension itself owes tax at basic rate (since it's not taxed at source).
    // The tax deducted from NHS pension pays the whole tax bill.
    basicRateTax = Math.round(inBasic * UK_TAX_RATES.basicRatePercent);
    higherRateTax = Math.round(inHigher * UK_TAX_RATES.higherRatePercent);
    additionalRateTax = Math.round(inAdditional * UK_TAX_RATES.additionalRatePercent);
  }

  const totalAnnualTax = basicRateTax + higherRateTax + additionalRateTax;
  const netAnnualPension = Math.max(0, grossPension - totalAnnualTax);
  const netMonthlyPension = Math.round(netAnnualPension / 12);
  const effectiveTaxRatePercent = grossPension > 0 
    ? Math.round((totalAnnualTax / grossPension) * 1000) / 10 
    : 0;

  return {
    grossAnnualPension: grossPension,
    taxFreePersonalAllowance: personalAllowance,
    taxablePensionIncome,
    basicRateTaxPaid: basicRateTax,
    higherRateTaxPaid: higherRateTax,
    additionalRateTaxPaid: additionalRateTax,
    totalAnnualTax,
    netAnnualPension,
    netMonthlyPension,
    effectiveTaxRatePercent,
  };
}
