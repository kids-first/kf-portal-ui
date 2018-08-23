export const formatPhoneNumber = phone => {
  return !phone ? '' : `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, -1)}`;
};
