import { CommutationOption } from '../types/pension';
import { UK_TAX_RATES } from '../data/taxBrackets';

export const COMMUTATION_EXCHANGE_RATIO = 12; // £12 lump sum per £1 pension surrendered

/**
 * Calculates max commutation permissible under HMRC rules (25% of capital value)
 * and evaluates a chosen commutation level (0% to 100% of max).
 */
export function calculateCommutation(
  initialAnnualPension: number,
  initialAutomaticLumpSum: number,
  commutationPercentChosen: number // 0% to 100% of maximum allowed
): CommutationOption {
  if (initialAnnualPension <= 0) {
    return {
      annualPensionSurrendered: 0,
      additionalTaxFreeLumpSum: 0,
      totalTaxFreeLumpSum: 0,
      finalAnnualPension: 0,
      maxTaxFreeLumpSum: 0,
      maxCommutationPension: 0,
    };
  }

  // Maximum surrenderable pension under HMRC 25% capital value formula:
  // P_surr_max = (20 * Pension_0 - 3 * LumpSum_0) / 56
  const numerator = (20 * initialAnnualPension) - (3 * initialAutomaticLumpSum);
  const rawMaxPensionSurrendered = Math.max(0, numerator / 56);

  // HMRC maximum lump sum cap (£268,275)
  const maxAllowableLumpSum = Math.min(
    initialAutomaticLumpSum + (rawMaxPensionSurrendered * COMMUTATION_EXCHANGE_RATIO),
    UK_TAX_RATES.lumpSumAllowanceCap
  );

  const maxCommutationPension = Math.max(0, (maxAllowableLumpSum - initialAutomaticLumpSum) / COMMUTATION_EXCHANGE_RATIO);

  // Apply chosen percentage of max
  const clampedChoicePercent = Math.min(Math.max(commutationPercentChosen, 0), 100) / 100;
  const annualPensionSurrendered = Math.round(maxCommutationPension * clampedChoicePercent);
  const additionalTaxFreeLumpSum = Math.round(annualPensionSurrendered * COMMUTATION_EXCHANGE_RATIO);
  const totalTaxFreeLumpSum = Math.min(initialAutomaticLumpSum + additionalTaxFreeLumpSum, UK_TAX_RATES.lumpSumAllowanceCap);
  const finalAnnualPension = Math.max(0, initialAnnualPension - annualPensionSurrendered);

  return {
    annualPensionSurrendered,
    additionalTaxFreeLumpSum,
    totalTaxFreeLumpSum,
    finalAnnualPension,
    maxTaxFreeLumpSum: Math.round(maxAllowableLumpSum),
    maxCommutationPension: Math.round(maxCommutationPension),
  };
}

