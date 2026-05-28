import { ProfileKey } from '../algorithm/calculate';

export const VALID_PROFILES: ProfileKey[] = [
  'balanced',
  'backpacker',
  'comfort',
  'cable-only',
  'no-cable',
];

export type CalculateRouteDto = {
  poiSlugs: string[];
  startSlug: string;
  profile: ProfileKey;
  circuit?: boolean;
  city?: string;
};
