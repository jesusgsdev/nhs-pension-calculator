/**
 * UK Income Tax Brackets and NHS Pension Contribution Tiers
 */

export interface PensionContributionTier {
  minPay: number;
  maxPay: number;
  ratePercent: number;
}

export const NHS_PENSION_CONTRIBUTION_TIERS: PensionContributionTier[] = [
  { minPay: 0, maxPay: 13295, ratePercent: 5.2 },
  { minPay: 13296, maxPay: 16831, ratePercent: 6.5 },
  { minPay: 16832, maxPay: 22878, ratePercent: 6.5 },
  { minPay: 22879, maxPay: 27997, ratePercent: 8.3 },
  { minPay: 27998, maxPay: 34961, ratePercent: 9.8 },
  { minPay: 34962, maxPay: 49550, ratePercent: 10.7 },
  { minPay: 49551, maxPay: 62924, ratePercent: 12.5 },
  { minPay: 62925, maxPay: Infinity, ratePercent: 13.5 },
];

export function getPensionContributionRate(annualPensionablePay: number): number {
  for (const tier of NHS_PENSION_CONTRIBUTION_TIERS) {
    if (annualPensionablePay >= tier.minPay && annualPensionablePay <= tier.maxPay) {
      return tier.ratePercent;
    }
  }
  return 13.5;
}

export const UK_TAX_RATES = {
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  basicRatePercent: 0.20,
  higherRatePercent: 0.40,
  additionalRatePercent: 0.45,
  lumpSumAllowanceCap: 268275, // Maximum tax-free lump sum in UK
  standardNewStatePensionAnnual: 11502, // 2024/25 full new State Pension
};

