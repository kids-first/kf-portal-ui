import intl from 'react-intl-universal';

// @see https://sciencenotes.org/how-to-convert-days-to-years/
const LEAP_YEARS = 365.2425;

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const sortByUpdateDate = <
  T extends {
    updated_date?: string;
  },
>(
  values: T[],
) =>
  values.sort((a, b) => {
    if (a.updated_date && b.updated_date) {
      return new Date(a.updated_date) < new Date(b.updated_date) ? 0 : -1;
    }
    return a.updated_date ? 0 : -1;
  });

export const readableDistanceByDays = (distanceInDays: number | string) =>
  intl.getHTML('date.yearsDaysFormat', {
    years: Math.floor(Number(distanceInDays) / LEAP_YEARS),
    days: Math.floor(Number(distanceInDays) % LEAP_YEARS),
  });
