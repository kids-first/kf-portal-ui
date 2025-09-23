import { FENCE_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';

import { FENCE_NAMES } from 'common/fenceTypes';
import { RootState } from 'store/types';

import { InitialState } from './types';

export type FencesProps = InitialState;

export const fencesSelector = (state: RootState) => state.fences;
export const fencesAuthorizedStudiesSelector = (state: RootState) => state.fences.authorizedStudies;
export const fencesAtLeastOneAuthentificationConnectedSelector = (state: RootState) =>
  state.fences[FENCE_NAMES.dcf].status === FENCE_AUTHENTIFICATION_STATUS.connected;

export const fencesAllAclsSelector = (state: RootState) => state.fences[FENCE_NAMES.dcf].acl;
