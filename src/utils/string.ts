export const truncateString = (text: string, maxLength: number) =>
  `${text.substring(0, maxLength)}${text.length > maxLength ? '...' : ''}`;

export const numberWithCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
