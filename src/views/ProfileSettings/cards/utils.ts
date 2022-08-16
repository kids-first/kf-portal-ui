export const OTHER_KEY = 'other';

export const removeOtherKey = (list: string[], otherValue: string) => {
  const listWithoutOtherKey = list.filter((value) => value !== OTHER_KEY);
  if (otherValue) {
    listWithoutOtherKey.push(otherValue);
  }
  return listWithoutOtherKey;
};
