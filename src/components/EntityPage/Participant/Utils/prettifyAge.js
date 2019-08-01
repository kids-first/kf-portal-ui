export default function prettifyAge(age) {
  if(age === null) return null;

  const years = Number(('' + age / 365).split('.')[0]);
  const days = age - years * 365;

  const y = years === 1
    ? `${years} year `
    : years === 0
      ? ""
      : `${years} years `;

  const d = days === 1
    ? `${days} day`
    : days === 0
      ? ""
      : `${days} days`;

  return y+d;
}