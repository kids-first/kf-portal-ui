export enum Provider {
  google = 'google',
  nih = 'nih',
  orcid = 'orcid',
}

export const formatProvider = (value: string) => {
  if (!value) return 'email';

  if (value === Provider.google) {
    return 'Google';
  }

  return value.toLocaleUpperCase();
};
