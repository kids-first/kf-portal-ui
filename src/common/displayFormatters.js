export const formatPhoneNumber = phone => {
  if (!phone) {
    return '';
  } else if (phone.length >= 10) {
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
  } else {
    return phone;
  }
};

/**
 *
 * @param {Array} addresses
 */
export const formatAddressLine = (addresses = []) => {
  return addresses.filter(x => x).join(', ');
};
