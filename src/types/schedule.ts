export type ShiftPatternType = 
  | 'regular_37_5'        // 5 days x 7.5h (8am-4pm with 30m break)
  | 'rotational_11_5'     // 11.5h net shifts (8am-8pm day or 8pm-8am night, 30m break)
  | 'night_shifts_only'   // 11.5h night shifts (8pm-8am)
  | 'day_shifts_only'     // 11.5h day shifts (8am-8pm)
  | 'compressed_hours'    // e.g. 4 days x 9.375h
  | 'custom';

export interface ScheduleConfig {
  patternType: ShiftPatternType;
  contractedHoursPerWeek: number; // standard 37.5h
  shiftLengthHours: number; // e.g. 7.5 or 11.5
  breakMinutes: number; // unpaid break, e.g. 30 min
  
  // Section 2 AfC Unsocial hours allocation (% of contracted hours)
  // Nights (20:00 - 06:00) & Saturdays (+30% for Bands 4-9)
  nightAndSaturdayPercentage: number;
  
  // Sundays & Bank Holidays (+60% for Bands 4-9)
  sundayAndBankHolidayPercentage: number;
  
  // Are enhancements contractual & pensionable? (Yes under standard NHS England AfC Section 2)
  isUnsocialHoursPensionable: boolean;
}

export interface ShiftCalculationResult {
  fte: number;
  basicHourlyRate: number;
  basicAnnualPay: number;
  hcasAnnualPay: number;
  nightSaturdayEnhancementPay: number;
  sundayBankHolidayEnhancementPay: number;
  totalUnsocialPay: number;
  totalGrossPay: number;
  totalPensionablePay: number;
  employeePensionContributionRate: number;
  annualEmployeePensionContribution: number;
  monthlyEmployeePensionContribution: number;
}

