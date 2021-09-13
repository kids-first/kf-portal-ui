import { ThunkDispatch } from 'redux-thunk';

import { ConnectionStatus } from './connectionTypes';
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
  removeAllFenceStudies = 'removeAllFenceStudies',
  addStudiesConnectionStatus = 'addStudiesConnectionStatus',
  toggleIsFetchingOneFenceStudies = 'toggleIsFetchingOneFenceStudies',
}

export type ToggleIsFetchingOneFenceStudiesAction = {
  type: FenceStudiesActions.toggleIsFetchingOneFenceStudies;
  isLoading: boolean;
  fenceName: FenceName;
};

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

export type RemoveAllFenceStudies = {
  type: FenceStudiesActions.removeAllFenceStudies;
};

export type FenceStudiesState = {
  fenceStudies: FenceStudies;
  loadingStudiesForFences: FenceName[];
  statuses: {
    [FenceName.gen3]: ConnectionStatus;
    [FenceName.dcf]: ConnectionStatus;
  };
};

export type AddStudiesConnectionStatusAction = {
  type: FenceStudiesActions.addStudiesConnectionStatus;
  fenceName: FenceName;
  newStatus: ConnectionStatus;
};

export type FenceStudiesActionTypes =
  | ToggleIsFetchingAllFenceStudiesAction
  | AddFenceStudiesAction
  | RemoveFenceStudies
  | RemoveAllFenceStudies
  | AddStudiesConnectionStatusAction
  | ToggleIsFetchingOneFenceStudiesAction;

export type DispatchFenceStudies = ThunkDispatch<RootState, null, FenceStudiesActionTypes>;
