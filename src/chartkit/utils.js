import _ from 'lodash';

export const truncateText = (string = '', length = 5) => _.truncate(string, { length: length });

export const maxValue = (data, keys) => {
  // get max value for each data element
  const maxValues = data.map(d => keys.reduce((acc, current) => d[current] + acc, 0));
  return Math.max(...maxValues);
};
