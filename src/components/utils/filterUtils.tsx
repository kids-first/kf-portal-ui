import { FilterInfo } from 'components/uiKit/FilterList/types';

export const getNoDataOptionValue = (
  field: string,
  filterGroups: {
    [type: string]: FilterInfo;
  },
): boolean | undefined => {
  let noDataInputOption = undefined;

  for (const value of Object.values(filterGroups)) {
    const groupWithField = value.groups.find((group) => group.facets.includes(field));
    if (groupWithField?.noDataOption?.includes(field)) {
      noDataInputOption = false;
      return noDataInputOption;
    }
  }

  return noDataInputOption;
};
