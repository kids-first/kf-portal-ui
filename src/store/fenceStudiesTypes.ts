import { ThunkDispatch } from 'redux-thunk';

import { FenceName, UserAcls } from './fenceTypes';
import { RootState } from './rootState';

export type FenceStudy = {
  acl: UserAcls;
  studyShortName: string;
  totalFiles: number;
  id: string;
  authorizedFiles: number;
};

export type FenceStudies = {
  [fenceName: string]: {
    authorizedStudies: FenceStudy[];
  };
};

export enum FenceStudiesActions {
  toggleIsFetchingAllFenceStudies = 'toggleIsFetchingAllFenceStudies',
  fetchFenceStudies = 'fetchFenceStudies',
  addFenceStudies = 'addFenceStudies',
  removeFenceStudies = 'removeFenceStudies',
}

export type ToggleIsFetchingAllFenceStudiesAction = {
  type: FenceStudiesActions.toggleIsFetchingAllFenceStudies;
  isLoading: boolean;
};

export type AddFenceStudiesAction = {
  type: FenceStudiesActions.addFenceStudies;
  fenceAuthorizedStudies: FenceStudies;
};

export type RemoveFenceStudies = {
  type: FenceStudiesActions.removeFenceStudies;
  fenceName: FenceName;
};

export type FenceStudiesState = {
  fenceStudies: FenceStudies;
  isFetchingAllFenceStudies: boolean;
};

export type FenceStudiesActionTypes =
  | ToggleIsFetchingAllFenceStudiesAction
  | AddFenceStudiesAction
  | RemoveFenceStudies;

export type DispatchFenceStudies = ThunkDispatch<RootState, null, FenceStudiesActionTypes>;
