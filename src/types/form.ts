export interface Country {
  code: string;
  name: string;
}

export interface Profession {
  id: string;
  name: string;
}

export interface Child {
  id: string;
  age: number;
}

export type FormData = {
  destinationCountries?: Country[];
  passportCountries?: Country[];
  status?: string;
  familySize?: string;
  numberOfKids?: number;
  kids?: Child[];
  budget?: string;
  timeline?: string;
  professions?: Profession[];
  partnerProfessions?: Profession[];
  targetCountries?: string[];
  additionalInfo?: string;
}

export const defaultFormData: FormData = {
  destinationCountries: [{ code: 'GB', name: 'United Kingdom' }],
  passportCountries: [],
  status: '',
  familySize: '',
  numberOfKids: 0,
  kids: [],
  budget: '',
  timeline: '',
  professions: [],
  partnerProfessions: [],
  additionalInfo: ''
};

export const familySizeOptions = [
  { value: '1', label: 'Just Me' },
  { value: '2', label: 'Couple' },
  { value: '3+', label: 'Family' }
];

export const kidsAgeGroups = Array.from({ length: 18 }, (_, i) => ({
  value: i.toString(),
  label: i === 0 ? 'Under 1 year' : `${i} year${i === 1 ? '' : 's'}`
}));

export const budgetOptions = [
  { value: 'low', label: '< $10k' },
  { value: 'medium', label: '$10k - $50k' },
  { value: 'high', label: '> $50k' }
];

export const timelineOptions = [
  { value: 'immediate', label: '< 3 months' },
  { value: 'soon', label: '3-6 months' },
  { value: 'later', label: '6+ months' }
];

export type UserLocation = 'home' | 'form' | 'plan';

export type UserProgress = {
  current_step: number;
  form_data: FormData | null;
  location: UserLocation;
  path: string;
}
