export const configureCols = cols =>
  cols.map((col, i) => ({ ...col, ...{ index: i, show: true } }));
