import { useSelector } from 'react-redux';
import { savedSetSelector } from './selector';
import EnvironmentVariables from '../../helpers/EnvVariables';
import { SetType } from 'services/api/savedSet/models';

export type { initialState as SavedSetInitialState } from './types';
export { default, SavedSetState } from './slice';

export const MAX_LENGTH_NAME = 50;
export const getSetFieldId = (type: SetType) => `${type}_facet_ids.${type}_fhir_id_1`;
export const PROJECT_ID = EnvironmentVariables.configFor('ARRANGER_PROJECT_ID');

export const useSavedSet = () => useSelector(savedSetSelector);
