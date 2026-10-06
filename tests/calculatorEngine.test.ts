import { describe, it, expect } from 'vitest';
import { calculateSalaryAndShifts, getBasicBandPay } from '../src/engine/salaryEngine';
import { calculate1995Pension } from '../src/engine/pension1995';
import { calculate2015Pension } from '../src/engine/pension2015';
import { evaluateMcCloudRemedy } from '../src/engine/mccloudRemedy';
import { calculateCommutation } from '../src/engine/commutationEngine';
import { calculatePensionTax } from '../src/engine/taxEngine';
import { calculateFullProjection } from '../src/engine/calculatorEngine';
import { ScheduleConfig } from '../src/types/schedule';
import { CareerPeriod } from '../src/types/afc';
import { PensionProfile } from '../src/types/pension';

describe('Agenda for Change Salary & Shifts Engine', () => {
  it('correctly retrieves 2025/26 AfC Band 7 pay step points', () => {
    expect(getBasicBandPay('Band 7', 'entry')).toBe(47810);
    expect(getBasicBandPay('Band 7', 'intermediate')).toBe(50273);
    expect(getBasicBandPay('Band 7', 'top')).toBe(54710);
  });

  it('correctly calculates Inner London HCAS with statutory max cap', () => {
    const regularSchedule: ScheduleConfig = {
      patternType: 'regular_37_5',
      contractedHoursPerWeek: 37.5,
      shiftLengthHours: 7.5,
      breakMinutes: 30,
      nightAndSaturdayPercentage: 0,
      sundayAndBankHolidayPercentage: 0,
      isUnsocialHoursPensionable: true,
    };

    // Band 7 top is £54,710. 20% is £10,942, capped at max £8,085
    const res = calculateSalaryAndShifts('Band 7', 'top', 'inner_london', regularSchedule);
    expect(res.basicAnnualPay).toBe(54710);
    expect(res.hcasAnnualPay).toBe(8085);
    expect(res.totalGrossPay).toBe(54710 + 8085);
    expect(res.employeePensionContributionRate).toBe(10.7);
  });

  it('correctly calculates rotational 11.5h shift enhancements (Section 2 AfC)', () => {
    const rotationalSchedule: ScheduleConfig = {
      patternType: 'rotational_11_5',
      contractedHoursPerWeek: 37.5,
      shiftLengthHours: 11.5,
      breakMinutes: 30,
      nightAndSaturdayPercentage: 25, // 25% night/Saturday (+30%)
      sundayAndBankHolidayPercentage: 10, // 10% Sunday/BH (+60%)
      isUnsocialHoursPensionable: true,
    };

    const res = calculateSalaryAndShifts('Band 5', 'top', 'national', rotationalSchedule);
    expect(res.basicAnnualPay).toBe(37796);
    expect(res.nightSaturdayEnhancementPay).toBeGreaterThan(0);
    expect(res.sundayBankHolidayEnhancementPay).toBeGreaterThan(0);
    expect(res.totalPensionablePay).toBe(res.totalGrossPay);
  });
});

describe('1995 Section Pension Engine', () => {
  it('calculates unreduced 1/80th and 3/80th lump sum for Special Class Status at age 55', () => {
    const res = calculate1995Pension({
      serviceYears: 20,
      finalPensionablePay: 50000,
      retirementAge: 55,
      hasSpecialClassStatus: true,
    });

    // 50,000 * 20 / 80 = 12,500
    expect(res.grossAnnualPension).toBe(12500);
    // Automatic lump sum = 3 * 12,500 = 37,500
    expect(res.automaticLumpSum).toBe(37500);
    // SCS enables unreduced retirement at 55
    expect(res.reducedGrossAnnualPension).toBe(12500);
    expect(res.reducedLumpSum).toBe(37500);
    expect(res.actuarialReductionPercent).toBe(0);
  });

  it('applies early retirement reduction if retiring before NPA without Special Class', () => {
    const res = calculate1995Pension({
      serviceYears: 20,
      finalPensionablePay: 50000,
      retirementAge: 55, // 5 years before standard NPA 60
      hasSpecialClassStatus: false,
    });

    expect(res.grossAnnualPension).toBe(12500);
    expect(res.reducedGrossAnnualPension).toBeLessThan(12500);
    expect(res.actuarialReductionPercent).toBeGreaterThan(20);
  });
});

describe('2015 CARE Pension & ERRBO', () => {
  it('calculates 1/54th accrual with CPI+1.5% compounding', () => {
    const res = calculate2015Pension({
      earningsHistory: [
        { calendarYear: 2022, pensionablePay: 40000 },
        { calendarYear: 2023, pensionablePay: 42000 },
      ],
      statePensionAge: 67,
      retirementAge: 67,
      errboYearsBought: 0,
      assumedCpiPercent: 2.0,
    });

    expect(res.grossAnnualPension).toBeGreaterThan((40000 / 54) + (42000 / 54));
    expect(res.actuarialReductionPercent).toBe(0);
  });

  it('protects against reduction when ERRBO years are bought', () => {
    const resWithErrbo = calculate2015Pension({
      earningsHistory: [{ calendarYear: 2022, pensionablePay: 50000 }],
      statePensionAge: 67,
      retirementAge: 65, // retiring at 65
      errboYearsBought: 2, // buys out 2 years reduction from 67 down to 65
    });

    // With 2-year ERRBO, retirement at 65 has 0 reduction
    expect(resWithErrbo.actuarialReductionPercent).toBe(0);

    const resWithoutErrbo = calculate2015Pension({
      earningsHistory: [{ calendarYear: 2022, pensionablePay: 50000 }],
      statePensionAge: 67,
      retirementAge: 65,
      errboYearsBought: 0,
    });
    expect(resWithoutErrbo.actuarialReductionPercent).toBeGreaterThan(0);
  });
});

describe('McCloud Remedy Comparison Engine', () => {
  it('evaluates remedy period between legacy 1995 and 2015 CARE', () => {
    const res = evaluateMcCloudRemedy({
      hasJoinedPre2012: true,
      legacyScheme: '1995',
      remedyYearsCount: 7,
      finalPensionablePay: 52000,
      remedyEarningsHistory: Array(7).fill({ calendarYear: 2015, pensionablePay: 40000 }),
      retirementAge: 60,
      statePensionAge: 67,
      hasSpecialClassStatus: false,
    });

    expect(res.eligibleForRemedy).toBe(true);
    expect(res.remedyYears).toBe(7);
    expect(res.legacyOption.annualPension).toBeGreaterThan(0);
    expect(res.legacyOption.lumpSum).toBeGreaterThan(0);
  });
});

describe('Commutation Engine (12:1 exchange ratio)', () => {
  it('respects HMRC 25% maximum capital value', () => {
    const res = calculateCommutation(20000, 60000, 100);
    expect(res.annualPensionSurrendered).toBeGreaterThan(0);
    expect(res.additionalTaxFreeLumpSum).toBe(res.annualPensionSurrendered * 12);
    expect(res.finalAnnualPension).toBe(20000 - res.annualPensionSurrendered);
  });
});

describe('UK Tax Engine on Pensions', () => {
  it('correctly applies Personal Allowance and 20% basic rate', () => {
    const taxRes = calculatePensionTax({
      grossAnnualPension: 22570,
      includeStatePension: false,
    });

    // 22,570 - 12,570 personal allowance = 10,000 taxable at 20% = £2,000 tax
    expect(taxRes.totalAnnualTax).toBe(2000);
    expect(taxRes.netAnnualPension).toBe(20570);
    expect(taxRes.netMonthlyPension).toBe(Math.round(20570 / 12));
  });
});

describe('Full Multi-Period Career Projection', () => {
  it('calculates multi-period progression from Band 5 to Band 7', () => {
    const periods: CareerPeriod[] = [
      {
        id: '1',
        roleTitle: 'Staff Nurse',
        band: 'Band 5',
        step: 'top',
        yearsInPeriod: 5,
        startAge: 22,
        endAge: 27,
        hcasLocation: 'national',
        partTimeFte: 1.0,
        startCalendarYear: 2005,
        endCalendarYear: 2010,
      },
      {
        id: '2',
        roleTitle: 'Sister',
        band: 'Band 7',
        step: 'top',
        yearsInPeriod: 15,
        startAge: 27,
        endAge: 42,
        hcasLocation: 'inner_london',
        partTimeFte: 1.0,
        startCalendarYear: 2010,
        endCalendarYear: 2025,
      },
    ];

    const schedule: ScheduleConfig = {
      patternType: 'regular_37_5',
      contractedHoursPerWeek: 37.5,
      shiftLengthHours: 7.5,
      breakMinutes: 30,
      nightAndSaturdayPercentage: 0,
      sundayAndBankHolidayPercentage: 0,
      isUnsocialHoursPensionable: true,
    };

    const profile: PensionProfile = {
      startCareerYear: 2005,
      currentAge: 42,
      targetRetirementAge: 60,
      statePensionAge: 67,
      hasSpecialClassStatus: false,
      mccloudChoice: 'optimal',
      errboYearsBought: 0,
      additionalPensionPurchased: 0,
      hasAddedYears: false,
      addedYearsCount: 0,
      commutationPercentage: 0,
      includeStatePensionInTax: false,
      fullNewStatePensionAmount: 11502,
    };

    const result = calculateFullProjection(periods, schedule, profile);
    expect(result.totalServiceYears).toBe(20);
    expect(result.finalGrossAnnualPension).toBeGreaterThan(0);
    expect(result.tax.netMonthlyPension).toBeGreaterThan(0);
  });
});

