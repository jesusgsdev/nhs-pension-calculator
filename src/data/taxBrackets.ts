/**
 * UK Income Tax Brackets and NHS Pension Contribution Tiers
 */

export interface PensionContributionTier {
  minPay: number;
  maxPay: number;
  ratePercent: number;
}

export const NHS_PENSION_CONTRIBUTION_TIERS: PensionContributionTier[] = [
  { minPay: 0, maxPay: 13259, ratePercent: 5.2 },
  { minPay: 13260, maxPay: 27797, ratePercent: 6.5 },
  { minPay: 27798, maxPay: 33868, ratePercent: 8.3 },
  { minPay: 33869, maxPay: 50845, ratePercent: 9.8 },
  { minPay: 50846, maxPay: 65190, ratePercent: 10.7 },
  { minPay: 65191, maxPay: Infinity, ratePercent: 12.5 },
];

export function getPensionContributionRate(annualPensionablePay: number): number {
  for (const tier of NHS_PENSION_CONTRIBUTION_TIERS) {
    if (annualPensionablePay >= tier.minPay && annualPensionablePay <= tier.maxPay) {
      return tier.ratePercent;
    }
  }
  return 12.5;
}

export const UK_TAX_RATES = {
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  basicRatePercent: 0.20,
  higherRatePercent: 0.40,
  additionalRatePercent: 0.45,
  lumpSumAllowanceCap: 268275, // Maximum tax-free lump sum in UK
  standardNewStatePensionAnnual: 11973, // 2025/26 full new State Pension (£230.25/wk)
};

