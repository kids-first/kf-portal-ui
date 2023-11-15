import { FilterInfo } from 'components/uiKit/FilterList/types';

export const getNoDataOptionValue = (
  field: string,
  filterGroups: {
    [type: string]: FilterInfo;
  },
): boolean | undefined => {
  let noDataInputOption = undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  for (const [key, value] of Object.entries(filterGroups)) {
    const groupWithField = value.groups.find((group) => group.facets.includes(field));
    if (groupWithField?.noDataOption?.includes(field)) {
      noDataInputOption = false;
      return noDataInputOption;
    }
  }

  return noDataInputOption;
};
