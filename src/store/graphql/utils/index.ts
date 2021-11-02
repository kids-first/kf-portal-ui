import { MISSING_DATA } from 'services/arranger';

export const keyEnhance = (key: string, type: string, s: string = ' No Data') => {
  switch (key) {
    case MISSING_DATA:
      return s;
    case '1':
      return type === 'boolean' ? 'True' : '1';
    case '0':
      return type === 'boolean' ? 'False' : '0';
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

export const dotToUnderscore = (str: string) => str.replaceAll('.', '__');
export const underscoreToDot = (str: string) => str.replaceAll('__', '.');
