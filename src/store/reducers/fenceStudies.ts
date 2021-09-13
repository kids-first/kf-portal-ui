import omit from 'lodash/omit';
import uniq from 'lodash/uniq';

import { ConnectionStatus } from '../connectionTypes';
import {
  FenceStudiesActions,
  FenceStudiesActionTypes,
  FenceStudiesState,
} from '../fenceStudiesTypes';
import { AllFencesNames, FenceName } from '../fenceTypes';
import { LogoutAction, UserActions } from '../userTypes';

const initialState: FenceStudiesState = {
  fenceStudies: {},
  loadingStudiesForFences: [],
  statuses: {
    [FenceName.gen3]: ConnectionStatus.unknown,
    [FenceName.dcf]: ConnectionStatus.unknown,
  },
};

export default (
  state = initialState,
  action: FenceStudiesActionTypes | LogoutAction,
): FenceStudiesState => {
  switch (action.type) {
    case FenceStudiesActions.toggleIsFetchingAllFenceStudies: {
      const newLoadingStudies = action.isLoading ? [...AllFencesNames] : [];
      return { ...state, loadingStudiesForFences: newLoadingStudies };
    }
    case FenceStudiesActions.addFenceStudies: {
      return {
        ...state,
        fenceStudies: {
          ...state.fenceStudies,
          ...action.fenceAuthorizedStudies,
        },
      };
    }
    case FenceStudiesActions.removeFenceStudies: {
      return {
        ...state,
        fenceStudies: omit(state.fenceStudies, [action.fenceName]),
      };
    }
    case UserActions.logout:
    case FenceStudiesActions.removeAllFenceStudies: {
      return { ...state, fenceStudies: {} };
    }
    case FenceStudiesActions.addStudiesConnectionStatus: {
      return {
        ...state,
        statuses: {
          ...state.statuses,
          [action.fenceName]: action.newStatus,
        },
      };
    }
    case FenceStudiesActions.toggleIsFetchingOneFenceStudies: {
      const isLoading = action.isLoading;
      const fenceName = action.fenceName;
      const oldLoadingStudiesForFences = [...state.loadingStudiesForFences];
      return {
        ...state,
        loadingStudiesForFences: isLoading
          ? uniq([...oldLoadingStudiesForFences, fenceName])
          : oldLoadingStudiesForFences.filter((fn) => fn !== fenceName),
      };
    }
    default:
      return state;
  }
};
