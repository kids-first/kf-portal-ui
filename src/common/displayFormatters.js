/**
 * Very basic number display formatting
 * @param {String} phone
 */
export const formatPhoneNumber = phone => {
  if (!phone) {
    return '';
  }

  const num = phone.replace(/\D/g, '');
  if (num.length <= 10) {
    return `${num.slice(0, 3)}-${num.slice(3, 6)}-${num.slice(6)}`;
  } else {
    return num;
  }
};

/**
 * Address single line formatter
 * @param {Array} addresses
 * @returns {String}
 */
export const formatAddressLine = (addresses = []) => {
  return addresses.filter(x => x).join(', ');
};
