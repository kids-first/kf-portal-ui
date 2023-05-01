import { formatHpoTitleAndCode, formatMondoTitleAndCode } from 'views/DataExploration/utils/helper';

export const transformNameIfNeeded = (field: string, name: string) => {
  if (field === 'mondo__name') {
    return formatMondoTitleAndCode(name);
  }
  if (field === 'observed_phenotype__name') {
    return formatHpoTitleAndCode(name);
  }
  if (field === 'file_format') {
    return <span>{name.toLocaleLowerCase()}</span>;
  }
  return name;
};
