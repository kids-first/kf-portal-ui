/**
 * Address single line formatter
 * @param {Array} addresses
 * @returns {String}
 */
export const formatAddressLine = (addresses = []) => {
  return addresses.filter(x => x).join(', ');
};

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
