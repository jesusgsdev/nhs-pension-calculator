export type PensionSchemeType = '1995' | '2008' | '2015';

export interface PensionProfile {
  startCareerYear: number;
  currentAge: number;
  targetRetirementAge: number;
  statePensionAge: number; // e.g. 67 or 68
  
  // Special Class Status (female nurses/midwives joined pre-6 March 1995)
  hasSpecialClassStatus: boolean;
  
  // McCloud Remedy choice for 1 April 2015 - 31 March 2022
  mccloudChoice: 'legacy' | '2015' | 'optimal';
  
  // Boosting options
  errboYearsBought: 0 | 1 | 2 | 3; // 2015 scheme ERRBO buy out
  additionalPensionPurchased: number; // Annual amount, e.g. £1,000 in £250 chunks
  hasAddedYears: boolean;
  addedYearsCount: number; // 1995 section added years
  
  // Commutation (surrendering pension for tax-free cash at 12:1)
  commutationPercentage: number; // 0% to max permissible (up to 25% HMRC capital value)
  
  // State Pension inclusion toggle (affects retirement tax post State Pension Age)
  includeStatePensionInTax: boolean;
  fullNewStatePensionAmount: number; // Current ~£11,502
}

export interface SchemeAccrualBreakdown {
  scheme: PensionSchemeType;
  label: string;
  serviceYears: number;
  normalPensionAge: number;
  grossAnnualPension: number;
  automaticLumpSum: number;
  actuarialReductionPercent: number; // e.g. 15.2% if early
  reducedGrossAnnualPension: number;
  reducedLumpSum: number;
  revaluationTotal?: number; // for 2015 CARE
}

export interface McCloudComparisonResult {
  eligibleForRemedy: boolean;
  remedyYears: number;
  legacyOption: {
    schemeName: string;
    annualPension: number;
    lumpSum: number;
  };
  scheme2015Option: {
    annualPension: number;
    lumpSum: number;
  };
  recommendedChoice: 'legacy' | '2015';
  differenceAnnualPension: number;
  differenceLumpSum: number;
}

export interface CommutationOption {
  annualPensionSurrendered: number;
  additionalTaxFreeLumpSum: number;
  totalTaxFreeLumpSum: number;
  finalAnnualPension: number;
  maxTaxFreeLumpSum: number;
  maxCommutationPension: number;
}

export interface PensionTaxCalculation {
  grossAnnualPension: number;
  taxFreePersonalAllowance: number;
  taxablePensionIncome: number;
  basicRateTaxPaid: number;
  higherRateTaxPaid: number;
  additionalRateTaxPaid: number;
  totalAnnualTax: number;
  netAnnualPension: number;
  netMonthlyPension: number;
  effectiveTaxRatePercent: number;
}

export interface FullRetirementProjection {
  currentFinalPensionablePay: number;
  targetRetirementAge: number;
  yearsUntilRetirement: number;
  totalServiceYears: number;
  
  // Scheme breakdown
  schemes: SchemeAccrualBreakdown[];
  mccloudComparison: McCloudComparisonResult;
  
  // Totals before commutation
  standardTotalAnnualPension: number;
  standardTotalLumpSum: number;
  
  // Boosting additions
  errboPensionProtected: number;
  additionalPensionBenefit: number;
  
  // Commutation state
  commutation: CommutationOption;
  
  // Final gross & net after chosen commutation & tax
  finalGrossAnnualPension: number;
  finalTaxFreeLumpSum: number;
  tax: PensionTaxCalculation;
}

