export function getSelectedFilter(filters) {
  const myArray = [];
  for (const key in filters) {
    if (filters[key] === true) {
      myArray.push(key);
    }
  }
  return myArray;
}

export const getCurrentStart = (page, pageSize) => {
  return pageSize * (page - 1);
};

export const getCurrentEnd = (page, pageSize) => {
  return page * pageSize;
};
