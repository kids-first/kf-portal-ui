/**
 * Title cases string
 * @param {String} string
 * @returns {String}
 */
export const titleCase = (string = '') => {
  return string.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase(),
  );
};
