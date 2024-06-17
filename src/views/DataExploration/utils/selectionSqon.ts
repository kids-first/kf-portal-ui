import { Key } from 'react';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { TAB_IDS } from 'views/DataExploration/utils/constant';

export const generateSelectionSqon = (
  type: Omit<TAB_IDS, TAB_IDS.SUMMARY>,
  ids: Key[],
  sampleField: string = '',
) => {
  let field;

  switch (type) {
    case TAB_IDS.BIOSPECIMENS:
      field = sampleField || 'sample_id';
      break;
    case TAB_IDS.DATA_FILES:
      field = 'file_id';
      break;
    default:
      field = 'participant_id';
      break;
  }

  return generateQuery({
    newFilters: [
      generateValueFilter({
        field,
        value: ids as string[],
      }),
    ],
  });
};
