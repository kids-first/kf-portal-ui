import { ProColumnType, TColumnStates } from '@ferlab/ui/core/components/ProTable/types';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { joinUniqueCleanWords } from 'helpers';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

/*
 * This function purpose is to determine if the columns in the user config
 * match those of the table. If one changes a col key in a table than the
 * user config, if used, could lead to incorrect display or action. Table cols must
 * have priority.
 * */
const userColsHaveSameKeyAsDefaultCols = (
  userCols: TColumnStates = [],
  // must never ever be empty
  defaultCols: ProColumnType[],
): boolean => {
  const userColsIsEmpty = userCols?.length === 0;
  const sizeMismatch = userCols.length !== defaultCols.length;
  if (userColsIsEmpty || sizeMismatch) {
    return false;
  }
  const defaultColsKeys = defaultCols.map((c) => c.key);
  return userCols.every((c) => defaultColsKeys.includes(c.key));
};

const mergeBiosDiagnosesSpecificField = (
  biospecimen: IBiospecimenEntity,
  key:
    | 'source_text'
    | 'source_text_tumor_location'
    | 'source_text_tumor_descriptor'
    | 'mondo_display_term'
    | 'diagnosis_ncit',
) =>
  joinUniqueCleanWords(biospecimen?.diagnoses?.hits?.edges?.map((e) => e.node[key]).flat()) ||
  TABLE_EMPTY_PLACE_HOLDER;

export { userColsHaveSameKeyAsDefaultCols, mergeBiosDiagnosesSpecificField };
