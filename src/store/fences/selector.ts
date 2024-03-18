import { FENCE_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';

import { FENCE_NAMES } from 'common/fenceTypes';
import { RootState } from 'store/types';

import { InitialState } from './types';

export type FencesProps = InitialState;

export const fencesSelector = (state: RootState) => state.fences;
export const fencesAuthorizedStudiesSelector = (state: RootState) => state.fences.authorizedStudies;
export const fencesAtLeastOneAuthentificationConnectedSelector = (state: RootState) =>
  Object.keys(FENCE_NAMES).some((fenceKey) => {
    const key = fenceKey as FENCE_NAMES;
    if (state.fences[key] === undefined) {
      return false;
    }

    return state.fences[key].status === FENCE_AUTHENTIFICATION_STATUS.connected;
  });

export const fencesAllAclsSelector = (state: RootState) => {
  let acls: string[] = [];
  Object.keys(FENCE_NAMES).forEach((fenceKey) => {
    const key = fenceKey as FENCE_NAMES;
    if (state.fences[key].acl.length > 0) {
      acls = [...acls, ...state.fences[key].acl];
    }
  });

  return acls;
};
