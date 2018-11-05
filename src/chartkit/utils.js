import _ from 'lodash';

export const truncateText = (string = '', length = 5) => _.truncate(string, { length: length });

export const maxValues = (data, keys) => {
  const values = {};
  data.forEach(d => (values[d.id] = keys.reduce((acc, current) => d[current] + acc, 0)));
  return values;
};

//export const chartMaxValue = maxValues => console.log(...maxValues);
