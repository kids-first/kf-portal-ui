import get from 'lodash/get';
import { differenceInYears, differenceInDays, addYears } from 'date-fns';

export const pickData = (data, valuePath, transform) => {
  const selectedData = get(data, valuePath, null);
  if (transform) {
    return transform(selectedData);
  }
  return selectedData === null ? '--' : selectedData;
};

export const formatDate = date => {
  const now = new Date();
  const yearDiff = differenceInYears(now, date);

  // get diff in days, only from months and days, not years
  const dateSameYear = addYears(date, yearDiff);
  const dayDiff = differenceInDays(now, dateSameYear);
  return `${yearDiff} years ${dayDiff} days`;
};

//https://ourcodeworld.com/articles/read/713/converting-bytes-to-human-readable-values-kb-mb-gb-tb-pb-eb-zb-yb-with-javascript
export const formatBytesToHumanReadable = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0';
  }

  const scale = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const matchedIndex = Math.floor(Math.log(bytes) / Math.log(scale));

  return (
    parseFloat((bytes / Math.pow(scale, matchedIndex)).toFixed(dm)) + ' ' + sizes[matchedIndex]
  );
};
