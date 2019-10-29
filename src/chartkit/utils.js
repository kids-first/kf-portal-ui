import truncate from 'lodash/truncate';

export const truncateText = (string = '', length = 5) => truncate(string, { length: length });

export const maxValues = (data, keys) => {
  const values = {};
  data.forEach(d => (values[d.id] = keys.reduce((acc, current) => d[current] + acc, 0)));
  return values;
};

export const getChartMaxValue = (data, keys) =>
  Math.max(...data.map(d => keys.reduce((acc, current) => d[current] + acc, 0)));

export const getTickValues = (interval, maxValue, dataSize) => {
  const tickValues = [];
  const divisor = roundTo(maxValue / interval, dataSize);
  for (let i = 0; i <= maxValue; i = i + divisor) {
    tickValues.push(i);
  }
  return tickValues;
};

export const getDataRangeSize = maxValue => {
  if (maxValue >= 1000000) {
    return 1000000;
  } else if (maxValue >= 100000) {
    return 100000;
  } else if (maxValue >= 10000) {
    return 10000;
  } else if (maxValue >= 1000) {
    return 1000;
  } else if (maxValue >= 100) {
    return 100;
  } else {
    return 10;
  }
};

export const roundTo = (val, rounding) => Math.ceil(val / rounding) * rounding;
