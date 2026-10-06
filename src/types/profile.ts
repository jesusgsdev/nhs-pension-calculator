import { RoleType, CareerPeriod } from './afc';
import { ScheduleConfig } from './schedule';
import { PensionProfile } from './pension';

export interface SavedProfile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  role: RoleType;
  careerPeriods: CareerPeriod[];
  schedule: ScheduleConfig;
  profile: PensionProfile;
}

