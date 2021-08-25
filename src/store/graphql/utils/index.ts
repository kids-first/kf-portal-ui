import { MISSING_DATA } from 'services/arranger';

export const keyEnhance = (key: string, s: string = ' No Data') => {
  switch (key) {
    case MISSING_DATA:
      return s;
    case '1':
      return 'True';
    case '0':
      return 'False';
    default:
      return key;
  }
};

export const keyEnhanceBooleanOnly = (key: string) => {
  switch (key) {
    case '1':
      return 'true';
    case '0':
      return 'false';
    default:
      return key;
  }
};

export const dotToUnderscore = (str: string) => str.replace('.', '__');
