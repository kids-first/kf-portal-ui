import { addYears, differenceInDays, differenceInYears } from 'date-fns';
import get from 'lodash/get';

export const pickData = (data, valuePath, transform) => {
  const selectedData = get(data, valuePath, null);
  if (transform) {
    return transform(selectedData);
  }
  return selectedData === null ? '--' : selectedData;
};

export const formatDate = (date) => {
  const now = new Date();
  const yearDiff = differenceInYears(now, date);

  // get diff in days, only from months and days, not years
  const dateSameYear = addYears(date, yearDiff);
  const dayDiff = differenceInDays(now, dateSameYear);
  return `${yearDiff} years ${dayDiff} days`;
};
