export interface Country {
  code: string;
  name: string;
}

export interface Profession {
  id: string;
  name: string;
}

export interface FormData {
  destinationCountries: Country[];
  passportCountries: Country[];
  status: string;
  familySize: string;
  budget: string;
  timeline: string;
  professions: Profession[];
}

export const defaultFormData: FormData = {
  destinationCountries: [{ code: 'GB', name: 'United Kingdom' }],
  passportCountries: [],
  status: '',
  familySize: '',
  budget: '',
  timeline: '',
  professions: []
};

export const familySizeOptions = [
  { value: '1', label: 'Just Me' },
  { value: '2', label: 'Couple' },
  { value: '3+', label: 'Family' }
];

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
