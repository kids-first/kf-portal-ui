import get from 'lodash/get';

export const pickData = (data, valuePath, transform) => {
  const selectedData = get(data, valuePath, null);
  if (transform) {
    return transform(selectedData);
  }
  return selectedData === null ? '--' : selectedData;
};
