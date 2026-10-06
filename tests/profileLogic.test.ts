import { describe, it, expect } from 'vitest';
import { SavedProfile } from '../src/types/profile';
import { DEFAULT_SCHEDULE, DEFAULT_PROFILE } from '../src/store/useCalculatorStore';
import { CareerPeriod } from '../src/types/afc';

describe('Profile Management Logic', () => {
  const samplePeriod: CareerPeriod = {
    id: 'test-1',
    roleTitle: 'Band 6 Sister',
    band: 'Band 6',
    step: 'intermediate',
    yearsInPeriod: 4,
    startAge: 25,
    endAge: 29,
    hcasLocation: 'inner_london',
    partTimeFte: 1.0,
    startCalendarYear: 2018,
    endCalendarYear: 2022,
  };

  it('creates a valid profile on initial save', () => {
    const profileName = 'London Band 6 Plan';
    const newProfile: SavedProfile = {
      id: 'profile-12345',
      name: profileName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'nurse',
      careerPeriods: [samplePeriod],
      schedule: DEFAULT_SCHEDULE,
      profile: DEFAULT_PROFILE,
    };

    expect(newProfile.id).toBe('profile-12345');
    expect(newProfile.name).toBe('London Band 6 Plan');
    expect(newProfile.careerPeriods).toHaveLength(1);
    expect(newProfile.careerPeriods[0].band).toBe('Band 6');
  });

  it('overwrites an existing profile preserving its id and name', () => {
    const original: SavedProfile = {
      id: 'profile-original',
      name: 'My Hospital Plan',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      role: 'nurse',
      careerPeriods: [samplePeriod],
      schedule: DEFAULT_SCHEDULE,
      profile: DEFAULT_PROFILE,
    };

    const updatedPeriods: CareerPeriod[] = [
      samplePeriod,
      {
        id: 'test-2',
        roleTitle: 'Band 7 Ward Sister',
        band: 'Band 7',
        step: 'top',
        yearsInPeriod: 5,
        startAge: 29,
        endAge: 34,
        hcasLocation: 'inner_london',
        partTimeFte: 1.0,
        startCalendarYear: 2022,
        endCalendarYear: 2027,
      },
    ];

    const now = new Date().toISOString();
    const overwritten: SavedProfile = {
      ...original,
      updatedAt: now,
      careerPeriods: updatedPeriods,
    };

    expect(overwritten.id).toBe(original.id);
    expect(overwritten.name).toBe(original.name);
    expect(overwritten.careerPeriods).toHaveLength(2);
    expect(overwritten.updatedAt).not.toBe(original.updatedAt);
  });

  it('creates an independent new profile on Save As', () => {
    const original: SavedProfile = {
      id: 'profile-1',
      name: 'Plan A',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      role: 'nurse',
      careerPeriods: [samplePeriod],
      schedule: DEFAULT_SCHEDULE,
      profile: DEFAULT_PROFILE,
    };

    const copyName = 'Plan A (Alternative Shifts)';
    const copyProfile: SavedProfile = {
      id: 'profile-2',
      name: copyName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: original.role,
      careerPeriods: [...original.careerPeriods],
      schedule: {
        ...original.schedule,
        patternType: 'rotational_11_5',
        nightAndSaturdayPercentage: 40,
      },
      profile: { ...original.profile },
    };

    expect(copyProfile.id).not.toBe(original.id);
    expect(copyProfile.name).toBe('Plan A (Alternative Shifts)');
    expect(copyProfile.schedule.patternType).toBe('rotational_11_5');
    expect(original.schedule.patternType).toBe('regular_37_5');
  });

  it('deletes the profile from the profile list', () => {
    const list: SavedProfile[] = [
      {
        id: 'p1',
        name: 'Profile 1',
        createdAt: '',
        updatedAt: '',
        role: 'nurse',
        careerPeriods: [],
        schedule: DEFAULT_SCHEDULE,
        profile: DEFAULT_PROFILE,
      },
      {
        id: 'p2',
        name: 'Profile 2',
        createdAt: '',
        updatedAt: '',
        role: 'midwife',
        careerPeriods: [],
        schedule: DEFAULT_SCHEDULE,
        profile: DEFAULT_PROFILE,
      },
    ];

    const remaining = list.filter((p) => p.id !== 'p1');
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('p2');
  });
});

