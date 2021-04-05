import { ThunkAction } from 'redux-thunk';
import { RootState } from '../rootState';
import { Sqon } from '../sqon';
import { setActiveSqonIndex, setSqons } from './virtualStudies';

export const createQueryInCohortBuilder = (
  sqons: Sqon[],
): ThunkAction<void, RootState, null, any> => async (dispatch) => {
  dispatch(setSqons(sqons));
  dispatch(setActiveSqonIndex(sqons.length - 1));
};
