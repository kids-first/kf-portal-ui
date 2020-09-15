export const getCohortBarColors = (data, theme) => {
  const { chartColors } = theme;
  const hasProbands = data.some((d) => d.probands !== 0);
  const hasFamilyMembers = data.some((d) => d.familyMembers !== 0);
  const colors = [];
  if (hasProbands) colors.push(chartColors.blue);
  if (hasFamilyMembers) colors.push(chartColors.purple);
  return colors;
};
