import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from '../rootState';
import { Sqon } from '../sqon';
import { setActiveSqonIndex, setSqons } from './virtualStudies';
import { StudyPageActionTypes } from '../StudyPageTypes';

export type DispatchStoryPage = ThunkDispatch<RootState, null, StudyPageActionTypes>;

export const createQueryInCohortBuilder = (
  sqons: Sqon[],
): ThunkAction<void, RootState, null, StudyPageActionTypes> => async (dispatch) => {
  dispatch(setSqons(sqons) as StudyPageActionTypes);
  dispatch(setActiveSqonIndex(sqons.length - 1) as StudyPageActionTypes);
};
