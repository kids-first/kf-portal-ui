import { useSelector } from 'react-redux';
import { singuralizeSetTypeIfNeeded } from 'views/DataExploration/components/SetsManagementDropdown';

import { SetType } from 'services/api/savedSet/models';

import EnvironmentVariables from '../../helpers/EnvVariables';

import { savedSetSelector } from './selector';
import { VARIANT_SAVED_SETS_FIELD } from 'views/Variants/utils/constants';

export type { initialState as SavedSetInitialState } from './types';
export { default, SavedSetState } from './slice';

export const MAX_LENGTH_NAME = 50;
export const getSetFieldId = (type: SetType) => {
  if (type === SetType.VARIANT) {
    return VARIANT_SAVED_SETS_FIELD;
  }

  if (type === SetType.FILES) {
    return `${singuralizeSetTypeIfNeeded(type)}_facet_ids.${singuralizeSetTypeIfNeeded(
      type,
    )}_fhir_id_1`;
  }

  return `${type}_facet_ids.${type}_fhir_id_1`;
};
export const PROJECT_ID = EnvironmentVariables.configFor('ARRANGER_PROJECT_ID');

export const useSavedSet = () => useSelector(savedSetSelector);
