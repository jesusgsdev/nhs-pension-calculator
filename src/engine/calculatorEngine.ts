import { CareerPeriod } from '../types/afc';
import { ScheduleConfig } from '../types/schedule';
import { 
  FullRetirementProjection, 
  PensionProfile, 
  SchemeAccrualBreakdown 
} from '../types/pension';
import { calculateSalaryAndShifts } from './salaryEngine';
import { calculate1995Pension } from './pension1995';
import { calculate2008Pension } from './pension2008';
import { calculate2015Pension, YearEarnings } from './pension2015';
import { evaluateMcCloudRemedy } from './mccloudRemedy';
import { calculateCommutation } from './commutationEngine';
import { calculatePensionTax } from './taxEngine';

/**
 * Master calculation engine orchestrating the complete NHS Nurse & Midwife Pay and Pension projection.
 */
export function calculateFullProjection(
  careerPeriods: CareerPeriod[],
  currentSchedule: ScheduleConfig,
  profile: PensionProfile
): FullRetirementProjection {
  if (careerPeriods.length === 0) {
    throw new Error('At least one career period is required.');
  }

  // 1. Calculate pay for each career period
  const periodCalculations = careerPeriods.map((period) => {
    const salaryResult = calculateSalaryAndShifts(
      period.band,
      period.step,
      period.hcasLocation,
      currentSchedule,
      period.customHcasPercentage
    );
    return {
      period,
      salaryResult,
      annualPensionablePay: salaryResult.totalPensionablePay,
    };
  });

  // Current / Final pensionable pay (from the latest career period)
  const finalPeriodCalc = periodCalculations[periodCalculations.length - 1];
  const finalPensionablePay = finalPeriodCalc.annualPensionablePay;

  // 2. Dissect service across calendar years
  // Determine legacy scheme type (1995 if started pre-2008, else 2008 if started 2008-2015, else 2015)
  const legacySchemeType: '1995' | '2008' = profile.startCareerYear < 2008 ? '1995' : '2008';
  const joinedPre2012 = profile.startCareerYear <= 2012;

  let pre2015LegacyYears = 0;
  let remedyYearsCount = 0;
  const remedyEarningsList: YearEarnings[] = [];
  const post2022EarningsList: YearEarnings[] = [];

  // Expand each career period into year-by-year earnings
  let runningYear = profile.startCareerYear;
  for (const calc of periodCalculations) {
    const years = calc.period.yearsInPeriod;
    for (let i = 0; i < years; i++) {
      const year = runningYear + i;
      const earnings = calc.annualPensionablePay;

      if (year < 2015) {
        pre2015LegacyYears += 1;
      } else if (year >= 2015 && year < 2022) {
        remedyYearsCount += 1;
        remedyEarningsList.push({ calendarYear: year, pensionablePay: earnings });
      } else {
        post2022EarningsList.push({ calendarYear: year, pensionablePay: earnings });
      }
    }
    runningYear += years;
  }

  const totalServiceYears = pre2015LegacyYears + remedyYearsCount + post2022EarningsList.length;

  // 3. Evaluate McCloud Remedy for 2015-2022
  const mccloudResult = evaluateMcCloudRemedy({
    hasJoinedPre2012: joinedPre2012,
    legacyScheme: legacySchemeType,
    remedyYearsCount,
    finalPensionablePay,
    remedyEarningsHistory: remedyEarningsList,
    retirementAge: profile.targetRetirementAge,
    statePensionAge: profile.statePensionAge,
    hasSpecialClassStatus: profile.hasSpecialClassStatus,
  });

  // Determine actual remedy allocation based on user choice
  let remedyGoesToLegacy = false;
  if (mccloudResult.eligibleForRemedy) {
    if (profile.mccloudChoice === 'optimal') {
      remedyGoesToLegacy = mccloudResult.recommendedChoice === 'legacy';
    } else {
      remedyGoesToLegacy = profile.mccloudChoice === 'legacy';
    }
  }

  const effectiveLegacyYears = pre2015LegacyYears + (remedyGoesToLegacy ? remedyYearsCount : 0);
  const careEarningsHistory = [
    ...(remedyGoesToLegacy ? [] : remedyEarningsList),
    ...post2022EarningsList,
  ];

  // 4. Calculate individual scheme breakdowns
  const schemes: SchemeAccrualBreakdown[] = [];

  // Legacy Scheme (1995 or 2008)
  if (effectiveLegacyYears > 0) {
    if (legacySchemeType === '1995') {
      const res1995 = calculate1995Pension({
        serviceYears: effectiveLegacyYears,
        addedYears: profile.hasAddedYears ? profile.addedYearsCount : 0,
        finalPensionablePay,
        retirementAge: profile.targetRetirementAge,
        hasSpecialClassStatus: profile.hasSpecialClassStatus,
      });
      schemes.push(res1995);
    } else {
      const res2008 = calculate2008Pension({
        serviceYears: effectiveLegacyYears,
        finalPensionablePay,
        retirementAge: profile.targetRetirementAge,
      });
      schemes.push(res2008);
    }
  }

  // 2015 Scheme CARE
  if (careEarningsHistory.length > 0) {
    const res2015 = calculate2015Pension({
      earningsHistory: careEarningsHistory,
      statePensionAge: profile.statePensionAge,
      retirementAge: profile.targetRetirementAge,
      errboYearsBought: profile.errboYearsBought,
    });
    schemes.push(res2015);
  }

  // 5. Aggregate base totals before commutation
  let standardTotalAnnualPension = schemes.reduce((sum, s) => sum + s.reducedGrossAnnualPension, 0);
  let standardTotalLumpSum = schemes.reduce((sum, s) => sum + s.reducedLumpSum, 0);

  // 6. Add Pension Boosting (Additional Pension)
  const additionalPensionBenefit = Math.max(0, profile.additionalPensionPurchased);
  standardTotalAnnualPension += additionalPensionBenefit;

  // 7. Calculate Commutation (12:1 exchange)
  const commutation = calculateCommutation(
    standardTotalAnnualPension,
    standardTotalLumpSum,
    profile.commutationPercentage
  );

  const finalGrossAnnualPension = commutation.finalAnnualPension;
  const finalTaxFreeLumpSum = commutation.totalTaxFreeLumpSum;

  // 8. Calculate Tax and Net Income
  const tax = calculatePensionTax({
    grossAnnualPension: finalGrossAnnualPension,
    includeStatePension: profile.includeStatePensionInTax && profile.targetRetirementAge >= profile.statePensionAge,
    statePensionAmount: profile.fullNewStatePensionAmount,
  });

  return {
    currentFinalPensionablePay: finalPensionablePay,
    targetRetirementAge: profile.targetRetirementAge,
    yearsUntilRetirement: Math.max(0, profile.targetRetirementAge - profile.currentAge),
    totalServiceYears,
    schemes,
    mccloudComparison: mccloudResult,
    standardTotalAnnualPension,
    standardTotalLumpSum,
    errboPensionProtected: profile.errboYearsBought > 0 ? 1 : 0,
    additionalPensionBenefit,
    commutation,
    finalGrossAnnualPension,
    finalTaxFreeLumpSum,
    tax,
  };
}

