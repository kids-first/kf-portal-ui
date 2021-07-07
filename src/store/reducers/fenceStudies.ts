import {
  FenceStudiesActions,
  FenceStudiesActionTypes,
  FenceStudiesState,
} from '../fenceStudiesTypes';

const initialState: FenceStudiesState = {
  fenceStudies: {},
  isFetchingAllFenceStudies: false,
};

export default (state = initialState, action: FenceStudiesActionTypes): FenceStudiesState => {
  switch (action.type) {
    case FenceStudiesActions.toggleIsFetchingAllFenceStudies: {
      return { ...state, isFetchingAllFenceStudies: action.isLoading };
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
    default:
      return state;
  }
};
