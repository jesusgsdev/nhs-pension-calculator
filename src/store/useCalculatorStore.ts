import { useState, useMemo, useEffect } from 'react';
import { RoleType, CareerPeriod } from '../types/afc';
import { ScheduleConfig } from '../types/schedule';
import { PensionProfile, FullRetirementProjection } from '../types/pension';
import { SavedProfile } from '../types/profile';
import { CAREER_PRESETS } from '../data/afcPayScales';
import { calculateFullProjection } from '../engine/calculatorEngine';
import { calculateSalaryAndShifts } from '../engine/salaryEngine';

const STORAGE_KEY_PROFILES = 'nhs_saved_profiles_v1';
const STORAGE_KEY_ACTIVE_ID = 'nhs_active_profile_id_v1';

export const DEFAULT_SCHEDULE: ScheduleConfig = {
  patternType: 'regular_37_5',
  contractedHoursPerWeek: 37.5,
  shiftLengthHours: 7.5,
  breakMinutes: 30,
  nightAndSaturdayPercentage: 15,
  sundayAndBankHolidayPercentage: 10,
  isUnsocialHoursPensionable: true,
};

export const DEFAULT_PROFILE: PensionProfile = {
  startCareerYear: 2010,
  currentAge: 38,
  targetRetirementAge: 60,
  statePensionAge: 67,
  hasSpecialClassStatus: false,
  mccloudChoice: 'optimal',
  errboYearsBought: 0,
  additionalPensionPurchased: 0,
  hasAddedYears: false,
  addedYearsCount: 0,
  commutationPercentage: 0,
  includeStatePensionInTax: true,
  fullNewStatePensionAmount: 11502,
};

function getInitialScratchPeriod(): CareerPeriod {
  const currentYear = new Date().getFullYear();
  return {
    id: `period-${Date.now()}-0`,
    roleTitle: 'Staff Nurse (Newly Qualified)',
    band: 'Band 5',
    step: 'entry',
    yearsInPeriod: 2,
    startAge: 22,
    endAge: 24,
    hcasLocation: 'national',
    partTimeFte: 1.0,
    startCalendarYear: currentYear - 2,
    endCalendarYear: currentYear,
  };
}

function loadSavedProfilesFromStorage(): SavedProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load profiles from localStorage', e);
  }
  return [];
}

function loadInitialActiveProfile(): SavedProfile | null {
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (!activeId) return null;
    const profiles = loadSavedProfilesFromStorage();
    return profiles.find((p) => p.id === activeId) || null;
  } catch {
    return null;
  }
}

export function useCalculator() {
  const initialActive = useMemo(() => loadInitialActiveProfile(), []);

  // Profiles management
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(loadSavedProfilesFromStorage);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    } catch {
      return null;
    }
  });

  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  // State
  const [role, setRole] = useState<RoleType>(() => initialActive?.role ?? 'nurse');
  const [schedule, setSchedule] = useState<ScheduleConfig>(() => initialActive?.schedule ?? DEFAULT_SCHEDULE);
  const [profile, setProfile] = useState<PensionProfile>(() => initialActive?.profile ?? DEFAULT_PROFILE);
  const [careerPeriods, setCareerPeriods] = useState<CareerPeriod[]>(() => {
    if (initialActive?.careerPeriods && initialActive.careerPeriods.length > 0) {
      return initialActive.careerPeriods;
    }
    const preset = CAREER_PRESETS.nurse[0];
    return preset.periods.map((p, index) => ({
      ...p,
      id: `period-${Date.now()}-${index}`,
    }));
  });

  // Persist savedProfiles whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(savedProfiles));
    } catch (e) {
      console.warn('Failed to save profiles to localStorage', e);
    }
  }, [savedProfiles]);

  // Persist activeProfileId
  useEffect(() => {
    try {
      if (activeProfileId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeProfileId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      }
    } catch (e) {
      console.warn('Failed to persist activeProfileId', e);
    }
  }, [activeProfileId]);

  // Save (overwrites if activeProfileId exists, otherwise needs a name)
  const saveProfile = (name?: string) => {
    const now = new Date().toISOString();

    if (activeProfileId) {
      // Overwrite existing profile
      setSavedProfiles((prev) =>
        prev.map((p) => {
          if (p.id !== activeProfileId) return p;
          return {
            ...p,
            updatedAt: now,
            role,
            careerPeriods,
            schedule,
            profile,
          };
        })
      );
      const current = savedProfiles.find((p) => p.id === activeProfileId);
      showNotification(`Saved changes to "${current?.name ?? 'Profile'}"`);
      return true;
    } else {
      // First-time save requires name
      if (!name || !name.trim()) return false;
      const newId = `profile-${Date.now()}`;
      const newProfile: SavedProfile = {
        id: newId,
        name: name.trim(),
        createdAt: now,
        updatedAt: now,
        role,
        careerPeriods,
        schedule,
        profile,
      };
      setSavedProfiles((prev) => [...prev, newProfile]);
      setActiveProfileId(newId);
      showNotification(`Profile "${newProfile.name}" created and saved!`);
      return true;
    }
  };

  // Save As (creates new profile with new name and sets as active)
  const saveProfileAs = (newName: string) => {
    if (!newName || !newName.trim()) return false;
    const now = new Date().toISOString();
    const newId = `profile-${Date.now()}`;
    const newProfile: SavedProfile = {
      id: newId,
      name: newName.trim(),
      createdAt: now,
      updatedAt: now,
      role,
      careerPeriods,
      schedule,
      profile,
    };
    setSavedProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newId);
    showNotification(`Saved as new profile "${newProfile.name}"!`);
    return true;
  };

  // Load a saved profile by ID
  const loadSavedProfile = (id: string) => {
    const found = savedProfiles.find((p) => p.id === id);
    if (!found) return;
    setRole(found.role);
    setSchedule(found.schedule);
    setProfile(found.profile);
    setCareerPeriods(found.careerPeriods);
    setActiveProfileId(id);
    showNotification(`Loaded profile "${found.name}"`);
  };

  // Start from scratch (resets inputs to fresh state, resets activeProfileId)
  const startFromScratch = () => {
    const freshPeriod = getInitialScratchPeriod();
    setRole('nurse');
    setSchedule(DEFAULT_SCHEDULE);
    setProfile({
      ...DEFAULT_PROFILE,
      currentAge: 24,
      startCareerYear: freshPeriod.startCalendarYear,
      targetRetirementAge: 60,
    });
    setCareerPeriods([freshPeriod]);
    setActiveProfileId(null);
    showNotification('Started fresh from scratch! Ready for new calculation.');
  };

  // Delete a saved profile
  const deleteProfile = (id: string) => {
    const found = savedProfiles.find((p) => p.id === id);
    setSavedProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
    }
    showNotification(`Deleted profile "${found?.name ?? id}"`);
  };

  // Presets
  const loadPreset = (presetIndex: number) => {
    const presets = CAREER_PRESETS[role];
    const targetPreset = presets[presetIndex] || presets[0];
    const newPeriods: CareerPeriod[] = targetPreset.periods.map((p, index) => ({
      ...p,
      id: `period-${Date.now()}-${index}`,
    }));
    setCareerPeriods(newPeriods);

    if (newPeriods.length > 0) {
      setProfile((prev) => ({
        ...prev,
        startCareerYear: newPeriods[0].startCalendarYear,
        currentAge: newPeriods[newPeriods.length - 1].endAge,
      }));
    }
  };

  // Add career period
  const addPeriod = () => {
    const lastPeriod = careerPeriods[careerPeriods.length - 1];
    const nextStartAge = lastPeriod ? lastPeriod.endAge : profile.currentAge;
    const nextStartYear = lastPeriod ? lastPeriod.endCalendarYear : new Date().getFullYear();

    const newPeriod: CareerPeriod = {
      id: `period-${Date.now()}`,
      roleTitle: 'Senior Clinical Role',
      band: lastPeriod ? lastPeriod.band : 'Band 7',
      step: 'top',
      yearsInPeriod: 5,
      startAge: nextStartAge,
      endAge: nextStartAge + 5,
      hcasLocation: lastPeriod ? lastPeriod.hcasLocation : 'national',
      partTimeFte: 1.0,
      startCalendarYear: nextStartYear,
      endCalendarYear: nextStartYear + 5,
    };

    setCareerPeriods([...careerPeriods, newPeriod]);
  };

  // Update period
  const updatePeriod = (id: string, updates: Partial<CareerPeriod>) => {
    setCareerPeriods((periods) =>
      periods.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates };
        if (updates.yearsInPeriod !== undefined) {
          updated.endAge = updated.startAge + updates.yearsInPeriod;
          updated.endCalendarYear = updated.startCalendarYear + updates.yearsInPeriod;
        }
        return updated;
      })
    );
  };

  // Remove period
  const removePeriod = (id: string) => {
    if (careerPeriods.length <= 1) return;
    setCareerPeriods((periods) => periods.filter((p) => p.id !== id));
  };

  // Switch role
  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    const presets = CAREER_PRESETS[newRole];
    const defaultPreset = presets[0];
    const newPeriods: CareerPeriod[] = defaultPreset.periods.map((p, index) => ({
      ...p,
      id: `period-${Date.now()}-${index}`,
    }));
    setCareerPeriods(newPeriods);
  };

  // Current active profile name
  const activeProfile = savedProfiles.find((p) => p.id === activeProfileId) || null;

  // Current period active salary
  const currentPeriod = careerPeriods[careerPeriods.length - 1];
  const currentSalaryBreakdown = useMemo(() => {
    if (!currentPeriod) return null;
    return calculateSalaryAndShifts(
      currentPeriod.band,
      currentPeriod.step,
      currentPeriod.hcasLocation,
      schedule,
      currentPeriod.customHcasPercentage
    );
  }, [currentPeriod, schedule]);

  // Full retirement projection
  const projection = useMemo<FullRetirementProjection | null>(() => {
    try {
      return calculateFullProjection(careerPeriods, schedule, profile);
    } catch (e) {
      console.error('Calculation error:', e);
      return null;
    }
  }, [careerPeriods, schedule, profile]);

  return {
    role,
    setRole: handleRoleChange,
    careerPeriods,
    addPeriod,
    updatePeriod,
    removePeriod,
    loadPreset,
    schedule,
    setSchedule,
    profile,
    setProfile,
    currentSalaryBreakdown,
    projection,
    // Profile Management
    savedProfiles,
    activeProfileId,
    activeProfile,
    saveProfile,
    saveProfileAs,
    loadSavedProfile,
    startFromScratch,
    deleteProfile,
    notificationMessage,
  };
}
