export type RoleType = 'nurse' | 'midwife';

export type AfCBand = 
  | 'Band 5'
  | 'Band 6'
  | 'Band 7'
  | 'Band 8a'
  | 'Band 8b'
  | 'Band 8c'
  | 'Band 8d'
  | 'Band 9';

export type PayStep = 'entry' | 'intermediate' | 'top';

export type HCASLocation = 'national' | 'fringe' | 'outer_london' | 'inner_london' | 'custom';

export interface HCASConfig {
  location: HCASLocation;
  customPercentage?: number;
}

export interface CareerPeriod {
  id: string;
  roleTitle: string;
  band: AfCBand;
  step: PayStep;
  yearsInPeriod: number;
  startAge: number;
  endAge: number;
  hcasLocation: HCASLocation;
  customHcasPercentage?: number;
  partTimeFte: number; // 1.0 for 37.5 hours, e.g. 0.8 for 30 hours
  // Historical year marker to map to pension scheme regimes
  startCalendarYear: number;
  endCalendarYear: number;
}

export interface PayPoint {
  band: AfCBand;
  step: PayStep;
  experienceLabel: string;
  annualSalary: number;
}

