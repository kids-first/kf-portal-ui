import flatMap from 'lodash/flatMap';
import isEmpty from 'lodash/isEmpty';
import { ThunkAction } from 'redux-thunk';

import { hasIntegrationTokenForFence } from 'components/Login/utils';
import { getAuthStudiesIdAndCount, getStudiesCountByNameAndAcl } from 'services/fenceStudies';

import { Api } from '../apiTypes';
import { FenceStudies, FenceStudiesActions, FenceStudiesActionTypes } from '../fenceStudiesTypes';
import { AclsByFence, FenceName, UserAcls } from '../fenceTypes';
import { RootState } from '../rootState';
import { selectFenceStudies } from '../selectors/fenceStudies';

const addWildCardToAcls = (acls: UserAcls) => [...(acls || []), '*'];

export const toggleIsFetchingAllFenceStudies = (isLoading: boolean): FenceStudiesActionTypes => ({
  type: FenceStudiesActions.toggleIsFetchingAllFenceStudies,
  isLoading,
});

export const addFenceStudies = (fenceAuthorizedStudies: FenceStudies): FenceStudiesActionTypes => ({
  type: FenceStudiesActions.addFenceStudies,
  fenceAuthorizedStudies: fenceAuthorizedStudies,
});

export const removeFenceStudies = (fenceName: FenceName): FenceStudiesActionTypes => ({
  type: FenceStudiesActions.removeFenceStudies,
  fenceName,
});

const shouldFetchFenceStudies = (fenceName: FenceName, state: RootState) => {
  const studiesForFence = selectFenceStudies(state)[fenceName];
  return (
    hasIntegrationTokenForFence(fenceName) &&
    (isEmpty(studiesForFence) || isEmpty(studiesForFence.authorizedStudies))
  );
};

export const fetchFenceStudies = (
  api: Api,
  fenceName: FenceName,
  userAcls: UserAcls,
): ThunkAction<void, RootState, null, FenceStudiesActionTypes> => async (dispatch) => {
  try {
    const aclsWithWildCard = addWildCardToAcls(userAcls);
    const studies = await getAuthStudiesIdAndCount(api, fenceName, aclsWithWildCard);
    const authorizedStudies = isEmpty(studies)
      ? []
      : await getStudiesCountByNameAndAcl(api, studies, aclsWithWildCard);

    dispatch(
      addFenceStudies({
        [fenceName]: {
          authorizedStudies: authorizedStudies || [],
        },
      }),
    );
  } catch (error) {
    console.error(`Error fetching fence studies for '${fenceName}': ${error}`);
  }
};

export const fetchFenceStudiesIfNeeded = (
  api: Api,
  fenceName: FenceName,
  aclsByFence: AclsByFence,
): ThunkAction<void, RootState, null, FenceStudiesActionTypes> => async (dispatch, getState) => {
  if (shouldFetchFenceStudies(fenceName, getState())) {
    const userAcls = aclsByFence[fenceName];
    return dispatch(fetchFenceStudies(api, fenceName, userAcls));
  }
};

export const fetchAllFenceStudiesIfNeeded = (
  api: Api,
  fencesName: FenceName[],
  aclsByFence: AclsByFence,
): ThunkAction<void, RootState, null, FenceStudiesActionTypes> => async (dispatch) => {
  dispatch(toggleIsFetchingAllFenceStudies(true));
  for (const fenceName of fencesName) {
    await dispatch(fetchFenceStudiesIfNeeded(api, fenceName, aclsByFence));
  }
  dispatch(toggleIsFetchingAllFenceStudies(false));
};

export const computeAllFencesAuthStudies = (fenceStudies: FenceStudies) => {
  if (isEmpty(fenceStudies)) {
    return [];
  }
  return flatMap(Object.values(fenceStudies), (studies) => studies.authorizedStudies);
};
