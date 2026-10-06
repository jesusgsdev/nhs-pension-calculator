import { AfCBand, PayStep, RoleType, CareerPeriod } from '../types/afc';

export interface BandPayScale {
  band: AfCBand;
  entry: number;
  intermediate?: number;
  top: number;
  intermediateThresholdYears?: number; // e.g. 2 years
  topThresholdYears: number; // e.g. 4 or 5 years
  stepLabels: Record<PayStep, string>;
}

export const AFC_PAY_SCALES_2025: Record<AfCBand, BandPayScale> = {
  'Band 5': {
    band: 'Band 5',
    entry: 31049,
    intermediate: 33487,
    top: 37796,
    intermediateThresholdYears: 2,
    topThresholdYears: 4,
    stepLabels: {
      entry: 'Entry (< 2 years experience)',
      intermediate: 'Intermediate (2–4 years)',
      top: 'Top of Band (4+ years)',
    },
  },
  'Band 6': {
    band: 'Band 6',
    entry: 38682,
    intermediate: 40823,
    top: 46580,
    intermediateThresholdYears: 2,
    topThresholdYears: 5,
    stepLabels: {
      entry: 'Entry (< 2 years experience)',
      intermediate: 'Intermediate (2–5 years)',
      top: 'Top of Band (5+ years)',
    },
  },
  'Band 7': {
    band: 'Band 7',
    entry: 47810,
    intermediate: 50273,
    top: 54710,
    intermediateThresholdYears: 2,
    topThresholdYears: 5,
    stepLabels: {
      entry: 'Entry (< 2 years experience)',
      intermediate: 'Intermediate (2–5 years)',
      top: 'Top of Band (5+ years)',
    },
  },
  'Band 8a': {
    band: 'Band 8a',
    entry: 55690,
    top: 62682,
    topThresholdYears: 5,
    stepLabels: {
      entry: 'Entry (< 5 years experience)',
      intermediate: 'Entry (< 5 years experience)',
      top: 'Top of Band (5+ years)',
    },
  },
  'Band 8b': {
    band: 'Band 8b',
    entry: 64455,
    top: 74896,
    topThresholdYears: 5,
    stepLabels: {
      entry: 'Entry (< 5 years experience)',
      intermediate: 'Entry (< 5 years experience)',
      top: 'Top of Band (5+ years)',
    },
  },
  'Band 8c': {
    band: 'Band 8c',
    entry: 76965,
    top: 88682,
    topThresholdYears: 5,
    stepLabels: {
      entry: 'Entry (< 5 years experience)',
      intermediate: 'Entry (< 5 years experience)',
      top: 'Top of Band (5+ years)',
    },
  },
  'Band 8d': {
    band: 'Band 8d',
    entry: 91342,
    top: 105337,
    topThresholdYears: 5,
    stepLabels: {
      entry: 'Entry (< 5 years experience)',
      intermediate: 'Entry (< 5 years experience)',
      top: 'Top of Band (5+ years)',
    },
  },
  'Band 9': {
    band: 'Band 9',
    entry: 109179,
    top: 125637,
    topThresholdYears: 5,
    stepLabels: {
      entry: 'Entry (< 5 years experience)',
      intermediate: 'Entry (< 5 years experience)',
      top: 'Top of Band (5+ years)',
    },
  },
};

// Backwards compatibility alias
export const AFC_PAY_SCALES_2024 = AFC_PAY_SCALES_2025;

export const ROLE_SAMPLE_TITLES: Record<RoleType, Record<AfCBand, string>> = {
  nurse: {
    'Band 5': 'Staff Nurse (Ward / Clinic)',
    'Band 6': 'Senior Staff Nurse / Specialist Nurse / Deputy Sister',
    'Band 7': 'Ward Sister / Charge Nurse / Clinical Nurse Specialist (CNS)',
    'Band 8a': 'Modern Matron / Advanced Nurse Practitioner (Lead)',
    'Band 8b': 'Lead Nurse / Senior Matron',
    'Band 8c': 'Associate Director of Nursing / Consultant Nurse',
    'Band 8d': 'Deputy Director of Nursing',
    'Band 9': 'Director of Nursing / Chief Nurse',
  },
  midwife: {
    'Band 5': 'Preceptorship Midwife (Newly Qualified)',
    'Band 6': 'Rotational Midwife / Specialist Midwife (Delivery Suite / Community)',
    'Band 7': 'Midwifery Sister / Team Leader / Specialist Midwife',
    'Band 8a': 'Matron for Maternity / Consultant Midwife',
    'Band 8b': 'Lead Midwife / Head of Midwifery',
    'Band 8c': 'Associate Director of Midwifery',
    'Band 8d': 'Deputy Director of Midwifery',
    'Band 9': 'Director of Midwifery / Chief Midwife',
  },
};

export const CAREER_PRESETS: Record<RoleType, Array<{ name: string; description: string; periods: Omit<CareerPeriod, 'id'>[] }>> = {
  nurse: [
    {
      name: 'Clinical Ward to Sister (Standard)',
      description: 'Band 5 staff nurse for 4 years, Band 6 deputy sister for 5 years, progressing to Band 7 Ward Sister.',
      periods: [
        {
          roleTitle: 'Staff Nurse',
          band: 'Band 5',
          step: 'top',
          yearsInPeriod: 4,
          startAge: 22,
          endAge: 26,
          hcasLocation: 'national',
          partTimeFte: 1.0,
          startCalendarYear: 2010,
          endCalendarYear: 2014,
        },
        {
          roleTitle: 'Senior Staff Nurse / Deputy Sister',
          band: 'Band 6',
          step: 'top',
          yearsInPeriod: 5,
          startAge: 26,
          endAge: 31,
          hcasLocation: 'national',
          partTimeFte: 1.0,
          startCalendarYear: 2014,
          endCalendarYear: 2019,
        },
        {
          roleTitle: 'Ward Sister / Charge Nurse',
          band: 'Band 7',
          step: 'top',
          yearsInPeriod: 15,
          startAge: 31,
          endAge: 46,
          hcasLocation: 'national',
          partTimeFte: 1.0,
          startCalendarYear: 2019,
          endCalendarYear: 2034,
        },
      ],
    },
    {
      name: 'London Specialist Nurse to Matron',
      description: 'Inner London career progression from Band 5 Staff Nurse to Band 8a Matron.',
      periods: [
        {
          roleTitle: 'Staff Nurse (Inner London)',
          band: 'Band 5',
          step: 'intermediate',
          yearsInPeriod: 3,
          startAge: 23,
          endAge: 26,
          hcasLocation: 'inner_london',
          partTimeFte: 1.0,
          startCalendarYear: 2012,
          endCalendarYear: 2015,
        },
        {
          roleTitle: 'Clinical Nurse Specialist',
          band: 'Band 6',
          step: 'top',
          yearsInPeriod: 4,
          startAge: 26,
          endAge: 30,
          hcasLocation: 'inner_london',
          partTimeFte: 1.0,
          startCalendarYear: 2015,
          endCalendarYear: 2019,
        },
        {
          roleTitle: 'Advanced Nurse Practitioner / Band 7',
          band: 'Band 7',
          step: 'top',
          yearsInPeriod: 6,
          startAge: 30,
          endAge: 36,
          hcasLocation: 'inner_london',
          partTimeFte: 1.0,
          startCalendarYear: 2019,
          endCalendarYear: 2025,
        },
        {
          roleTitle: 'Modern Matron',
          band: 'Band 8a',
          step: 'top',
          yearsInPeriod: 12,
          startAge: 36,
          endAge: 48,
          hcasLocation: 'inner_london',
          partTimeFte: 1.0,
          startCalendarYear: 2025,
          endCalendarYear: 2037,
        },
      ],
    },
  ],
  midwife: [
    {
      name: 'Midwifery Preceptorship Fast-Track',
      description: 'Typical midwifery pathway: 2 years Band 5 preceptorship, advancing to Band 6 rotational midwife, then Band 7 team leader.',
      periods: [
        {
          roleTitle: 'Preceptorship Midwife',
          band: 'Band 5',
          step: 'entry',
          yearsInPeriod: 2,
          startAge: 22,
          endAge: 24,
          hcasLocation: 'national',
          partTimeFte: 1.0,
          startCalendarYear: 2014,
          endCalendarYear: 2016,
        },
        {
          roleTitle: 'Rotational Midwife (Delivery Suite & Community)',
          band: 'Band 6',
          step: 'top',
          yearsInPeriod: 6,
          startAge: 24,
          endAge: 30,
          hcasLocation: 'national',
          partTimeFte: 1.0,
          startCalendarYear: 2016,
          endCalendarYear: 2022,
        },
        {
          roleTitle: 'Midwifery Sister / Team Leader',
          band: 'Band 7',
          step: 'top',
          yearsInPeriod: 16,
          startAge: 30,
          endAge: 46,
          hcasLocation: 'national',
          partTimeFte: 1.0,
          startCalendarYear: 2022,
          endCalendarYear: 2038,
        },
      ],
    },
    {
      name: 'Midwifery Consultant Pathway',
      description: 'Midwife progressing through Band 5, 6, 7 and into Band 8a Consultant Midwife.',
      periods: [
        {
          roleTitle: 'Preceptorship Midwife',
          band: 'Band 5',
          step: 'entry',
          yearsInPeriod: 2,
          startAge: 23,
          endAge: 25,
          hcasLocation: 'outer_london',
          partTimeFte: 1.0,
          startCalendarYear: 2010,
          endCalendarYear: 2012,
        },
        {
          roleTitle: 'Specialist Midwife',
          band: 'Band 6',
          step: 'top',
          yearsInPeriod: 5,
          startAge: 25,
          endAge: 30,
          hcasLocation: 'outer_london',
          partTimeFte: 1.0,
          startCalendarYear: 2012,
          endCalendarYear: 2017,
        },
        {
          roleTitle: 'Labour Ward Coordinator',
          band: 'Band 7',
          step: 'top',
          yearsInPeriod: 6,
          startAge: 30,
          endAge: 36,
          hcasLocation: 'outer_london',
          partTimeFte: 1.0,
          startCalendarYear: 2017,
          endCalendarYear: 2023,
        },
        {
          roleTitle: 'Consultant Midwife',
          band: 'Band 8a',
          step: 'top',
          yearsInPeriod: 10,
          startAge: 36,
          endAge: 46,
          hcasLocation: 'outer_london',
          partTimeFte: 1.0,
          startCalendarYear: 2023,
          endCalendarYear: 2033,
        },
      ],
    },
  ],
};

