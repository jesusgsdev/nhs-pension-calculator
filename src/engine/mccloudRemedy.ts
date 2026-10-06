import { McCloudComparisonResult } from '../types/pension';
import { calculate1995Pension } from './pension1995';
import { calculate2008Pension } from './pension2008';
import { calculate2015Pension, YearEarnings } from './pension2015';

export interface McCloudInput {
  hasJoinedPre2012: boolean;
  legacyScheme: '1995' | '2008';
  remedyYearsCount: number; // up to 7 years (2015 - 2022)
  finalPensionablePay: number;
  remedyEarningsHistory: YearEarnings[];
  retirementAge: number;
  statePensionAge: number;
  hasSpecialClassStatus: boolean;
}

/**
 * Calculates and compares benefits for the McCloud Remedy window (2015-2022).
 */
export function evaluateMcCloudRemedy(input: McCloudInput): McCloudComparisonResult {
  if (!input.hasJoinedPre2012 || input.remedyYearsCount <= 0) {
    return {
      eligibleForRemedy: false,
      remedyYears: 0,
      legacyOption: {
        schemeName: 'N/A',
        annualPension: 0,
        lumpSum: 0,
      },
      scheme2015Option: {
        annualPension: 0,
        lumpSum: 0,
      },
      recommendedChoice: 'legacy',
      differenceAnnualPension: 0,
      differenceLumpSum: 0,
    };
  }

  // Calculate Option A: Legacy Scheme for remedy years
  let legacyAnnualPension = 0;
  let legacyLumpSum = 0;
  const legacySchemeName = input.legacyScheme === '1995' ? '1995 Section' : '2008 Section';

  if (input.legacyScheme === '1995') {
    const res1995 = calculate1995Pension({
      serviceYears: input.remedyYearsCount,
      finalPensionablePay: input.finalPensionablePay,
      retirementAge: input.retirementAge,
      hasSpecialClassStatus: input.hasSpecialClassStatus,
    });
    legacyAnnualPension = res1995.reducedGrossAnnualPension;
    legacyLumpSum = res1995.reducedLumpSum;
  } else {
    const res2008 = calculate2008Pension({
      serviceYears: input.remedyYearsCount,
      finalPensionablePay: input.finalPensionablePay,
      retirementAge: input.retirementAge,
    });
    legacyAnnualPension = res2008.reducedGrossAnnualPension;
    legacyLumpSum = 0;
  }

  // Calculate Option B: 2015 CARE Scheme for remedy years
  const res2015 = calculate2015Pension({
    earningsHistory: input.remedyEarningsHistory,
    statePensionAge: input.statePensionAge,
    retirementAge: input.retirementAge,
    errboYearsBought: 0,
  });
  const scheme2015AnnualPension = res2015.reducedGrossAnnualPension;
  const scheme2015LumpSum = 0;

  // Comparison logic: evaluate total value. Standard HMRC commutation evaluates lump sum at 12:1.
  // Legacy total capital value ~ (legacyAnnualPension * 20) + legacyLumpSum
  // 2015 total capital value ~ (scheme2015AnnualPension * 20)
  const legacyValuation = (legacyAnnualPension * 20) + legacyLumpSum;
  const scheme2015Valuation = (scheme2015AnnualPension * 20) + scheme2015LumpSum;

  const recommendedChoice: 'legacy' | '2015' = legacyValuation >= scheme2015Valuation ? 'legacy' : '2015';

  return {
    eligibleForRemedy: true,
    remedyYears: input.remedyYearsCount,
    legacyOption: {
      schemeName: legacySchemeName,
      annualPension: legacyAnnualPension,
      lumpSum: legacyLumpSum,
    },
    scheme2015Option: {
      annualPension: scheme2015AnnualPension,
      lumpSum: scheme2015LumpSum,
    },
    recommendedChoice,
    differenceAnnualPension: scheme2015AnnualPension - legacyAnnualPension,
    differenceLumpSum: scheme2015LumpSum - legacyLumpSum,
  };
}
