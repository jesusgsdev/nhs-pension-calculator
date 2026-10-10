import { describe, it, expect } from 'vitest';
import { calculate2008Pension } from '../src/engine/pension2008';
import { evaluateMcCloudRemedy } from '../src/engine/mccloudRemedy';
import { calculateCommutation } from '../src/engine/commutationEngine';
import { calculatePensionTax } from '../src/engine/taxEngine';

describe('2008 Section pension (1/60th, NPA 65)', () => {
  it('accrues 1/60th of final pay per year with no reduction at NPA', () => {
    const res = calculate2008Pension({ serviceYears: 30, finalPensionablePay: 60000, retirementAge: 65 });
    expect(res.scheme).toBe('2008');
    expect(res.normalPensionAge).toBe(65);
    expect(res.grossAnnualPension).toBe(30000);
    expect(res.reducedGrossAnnualPension).toBe(30000);
    expect(res.actuarialReductionPercent).toBe(0);
    expect(res.automaticLumpSum).toBe(0);
  });

  it('reduces the pension when retiring before 65', () => {
    const res = calculate2008Pension({ serviceYears: 30, finalPensionablePay: 60000, retirementAge: 60 });
    expect(res.reducedGrossAnnualPension).toBeLessThan(res.grossAnnualPension);
    expect(res.actuarialReductionPercent).toBeGreaterThan(0);
  });

  it('treats negative service as zero', () => {
    const res = calculate2008Pension({ serviceYears: -5, finalPensionablePay: 60000, retirementAge: 65 });
    expect(res.grossAnnualPension).toBe(0);
  });
});

describe('McCloud remedy edge cases', () => {
  const base = {
    hasJoinedPre2012: true,
    remedyYearsCount: 7,
    finalPensionablePay: 52000,
    remedyEarningsHistory: Array(7).fill({ calendarYear: 2015, pensionablePay: 40000 }),
    retirementAge: 65,
    statePensionAge: 67,
    hasSpecialClassStatus: false,
  };

  it('is not eligible for members who joined after 2012', () => {
    const res = evaluateMcCloudRemedy({ ...base, legacyScheme: '1995', hasJoinedPre2012: false });
    expect(res.eligibleForRemedy).toBe(false);
    expect(res.remedyYears).toBe(0);
    expect(res.recommendedChoice).toBe('legacy');
  });

  it('is not eligible with no remedy years', () => {
    const res = evaluateMcCloudRemedy({ ...base, legacyScheme: '2008', remedyYearsCount: 0 });
    expect(res.eligibleForRemedy).toBe(false);
  });

  it('compares the 2008 legacy section against 2015 CARE without a legacy lump sum', () => {
    const res = evaluateMcCloudRemedy({ ...base, legacyScheme: '2008' });
    expect(res.eligibleForRemedy).toBe(true);
    expect(res.legacyOption.schemeName).toBe('2008 Section');
    expect(res.legacyOption.lumpSum).toBe(0);
    expect(res.legacyOption.annualPension).toBeGreaterThan(0);
    expect(res.differenceAnnualPension).toBe(
      res.scheme2015Option.annualPension - res.legacyOption.annualPension,
    );
  });

  it('recommends 2015 CARE when it is worth more than the legacy benefit', () => {
    const res = evaluateMcCloudRemedy({
      ...base,
      legacyScheme: '2008',
      finalPensionablePay: 10000,
      remedyEarningsHistory: Array(7).fill({ calendarYear: 2015, pensionablePay: 90000 }),
    });
    expect(res.recommendedChoice).toBe('2015');
  });
});

describe('Commutation edge cases', () => {
  it('returns zeros when there is no pension', () => {
    const res = calculateCommutation(0, 0, 100);
    expect(res.finalAnnualPension).toBe(0);
    expect(res.totalTaxFreeLumpSum).toBe(0);
  });

  it('surrenders nothing at 0% and more pension at 100%', () => {
    const none = calculateCommutation(20000, 0, 0);
    const max = calculateCommutation(20000, 0, 100);
    expect(none.annualPensionSurrendered).toBe(0);
    expect(max.annualPensionSurrendered).toBeGreaterThan(0);
    expect(max.finalAnnualPension).toBeLessThan(20000);
  });
});

describe('Pension income tax', () => {
  it('charges nothing under the personal allowance', () => {
    const res = calculatePensionTax({ grossAnnualPension: 10000, includeStatePension: false });
    expect(res.basicRateTaxPaid).toBe(0);
    expect(res.netAnnualPension).toBe(10000);
    expect(res.effectiveTaxRatePercent).toBe(0);
  });

  it('applies higher-rate tax on large pensions', () => {
    const res = calculatePensionTax({ grossAnnualPension: 70000, includeStatePension: false });
    expect(res.higherRateTaxPaid).toBeGreaterThan(0);
  });

  it('applies additional-rate tax and tapers the allowance above £100k', () => {
    const res = calculatePensionTax({ grossAnnualPension: 150000, includeStatePension: false });
    expect(res.additionalRateTaxPaid).toBeGreaterThan(0);
    expect(res.taxFreePersonalAllowance).toBe(0);
  });

  it('uses up personal allowance with the state pension first', () => {
    const without = calculatePensionTax({ grossAnnualPension: 20000, includeStatePension: false });
    const withSp = calculatePensionTax({ grossAnnualPension: 20000, includeStatePension: true });
    expect(withSp.basicRateTaxPaid).toBeGreaterThan(without.basicRateTaxPaid);
  });

  it('handles zero and negative pensions', () => {
    const res = calculatePensionTax({ grossAnnualPension: -100, includeStatePension: false });
    expect(res.grossAnnualPension).toBe(0);
    expect(res.effectiveTaxRatePercent).toBe(0);
  });
});
