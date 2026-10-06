/**
 * Actuarial Early and Late Retirement Factors for NHS Pension Schemes
 * Source: Government Actuary's Department (GAD) tables for NHS Pension Schemes
 */

export const SCHEME_2015_EARLY_REDUCTION_FACTORS: Record<number, number> = {
  0: 1.000,
  1: 0.946,
  2: 0.896,
  3: 0.850,
  4: 0.806,
  5: 0.765,
  6: 0.727,
  7: 0.691,
  8: 0.658,
  9: 0.627,
  10: 0.598,
  11: 0.571,
  12: 0.545,
  13: 0.521,
};

export const SCHEME_1995_EARLY_PENSION_FACTORS: Record<number, number> = {
  0: 1.000,
  1: 0.946,
  2: 0.897,
  3: 0.852,
  4: 0.810,
  5: 0.771,
  6: 0.735,
  7: 0.702,
  8: 0.670,
  9: 0.641,
  10: 0.613,
};

export const SCHEME_1995_EARLY_LUMP_SUM_FACTORS: Record<number, number> = {
  0: 1.000,
  1: 0.974,
  2: 0.949,
  3: 0.925,
  4: 0.902,
  5: 0.880,
  6: 0.859,
  7: 0.838,
  8: 0.819,
  9: 0.800,
  10: 0.781,
};

/**
 * Gets the actuarial factor for the 2015 Scheme based on years before/after NPA.
 */
export function get2015ActuarialFactor(yearsDifference: number): number {
  if (yearsDifference === 0) return 1.0;
  
  if (yearsDifference > 0) {
    // Early retirement (years before NPA)
    const clampedYears = Math.min(Math.max(Math.round(yearsDifference), 0), 13);
    return SCHEME_2015_EARLY_REDUCTION_FACTORS[clampedYears] ?? 0.521;
  } else {
    // Late retirement enhancement (~3.2% per year deferred past SPA)
    const lateYears = Math.abs(yearsDifference);
    return 1 + (lateYears * 0.032);
  }
}

/**
 * Gets the actuarial factor for the 1995 Section (Pension and Lump sum).
 */
export function get1995ActuarialFactor(yearsEarly: number): { pensionFactor: number; lumpSumFactor: number } {
  if (yearsEarly <= 0) {
    return { pensionFactor: 1.0, lumpSumFactor: 1.0 };
  }
  const clamped = Math.min(Math.max(Math.round(yearsEarly), 0), 10);
  return {
    pensionFactor: SCHEME_1995_EARLY_PENSION_FACTORS[clamped] ?? 0.613,
    lumpSumFactor: SCHEME_1995_EARLY_LUMP_SUM_FACTORS[clamped] ?? 0.781,
  };
}

