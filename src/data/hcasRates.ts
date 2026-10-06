import { HCASLocation } from '../types/afc';

export interface HCASDefinition {
  label: string;
  description: string;
  percentage: number;
  minCap: number;
  maxCap: number;
}

export const HCAS_DEFINITIONS: Record<HCASLocation, HCASDefinition> = {
  national: {
    label: 'National (No London Weighting)',
    description: 'Outside London and the fringe area (standard NHS Agenda for Change rate).',
    percentage: 0,
    minCap: 0,
    maxCap: 0,
  },
  inner_london: {
    label: 'Inner London',
    description: '20% of basic salary, subject to a minimum of £5,138 and maximum of £8,010 per annum.',
    percentage: 0.20,
    minCap: 5138,
    maxCap: 8010,
  },
  outer_london: {
    label: 'Outer London',
    description: '15% of basic salary, subject to a minimum of £4,313 and maximum of £5,436 per annum.',
    percentage: 0.15,
    minCap: 4313,
    maxCap: 5436,
  },
  fringe: {
    label: 'Fringe Zone',
    description: '5% of basic salary, subject to a minimum of £1,192 and maximum of £2,011 per annum.',
    percentage: 0.05,
    minCap: 1192,
    maxCap: 2011,
  },
  custom: {
    label: 'Custom Weighting',
    description: 'Specify a custom percentage for local trust adjustments.',
    percentage: 0,
    minCap: 0,
    maxCap: 999999,
  },
};

/**
 * Calculates High Cost Area Supplement given basic pay and region.
 */
export function calculateHCAS(basicPay: number, location: HCASLocation, customPercentage?: number): number {
  if (location === 'national') return 0;
  
  if (location === 'custom') {
    const rate = (customPercentage ?? 0) / 100;
    return Math.round(basicPay * rate);
  }

  const def = HCAS_DEFINITIONS[location];
  if (!def || def.percentage === 0) return 0;

  const rawHcas = basicPay * def.percentage;
  const cappedHcas = Math.min(Math.max(rawHcas, def.minCap), def.maxCap);
  return Math.round(cappedHcas);
}

