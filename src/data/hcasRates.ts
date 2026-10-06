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
    description: '20% of basic salary, subject to a minimum of £5,323 and maximum of £8,085 per annum (2025/26).',
    percentage: 0.20,
    minCap: 5323,
    maxCap: 8085,
  },
  outer_london: {
    label: 'Outer London',
    description: '15% of basic salary, subject to a minimum of £4,457 and maximum of £5,582 per annum (2025/26).',
    percentage: 0.15,
    minCap: 4457,
    maxCap: 5582,
  },
  fringe: {
    label: 'Fringe Zone',
    description: '5% of basic salary, subject to a minimum of £1,224 and maximum of £2,137 per annum (2025/26).',
    percentage: 0.05,
    minCap: 1224,
    maxCap: 2137,
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

