import _ from 'lodash';
import { differenceInYears, differenceInDays, addYears } from 'date-fns';

export const pickData = (data, valuePath, transform = x => x) => {
  const selectedData = _.get(data, valuePath, null);
  return selectedData ? transform(selectedData) : '--';
};

export const formatDate = date => {
  const now = new Date();
  const yearDiff = differenceInYears(now, date);

  // get diff in days, only from months and days, not years
  const dateSameYear = addYears(date, yearDiff);
  const dayDiff = differenceInDays(now, dateSameYear);
  return `${yearDiff} years ${dayDiff} days`;
};

export const formatToGB = size => `${(size / 1000000000).toFixed(2)} GB`;
