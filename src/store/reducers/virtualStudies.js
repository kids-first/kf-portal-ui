import { UserActions } from 'store/userTypes';
import { VirtualStudiesActions } from 'store/virtualStudiesTypes';

const initialState = {
  studies: [],
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_REQUESTED:
      return {
        ...state,
        isLoading: true,
      };

    case VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_SUCCESS:
      return {
        ...state,
        studies: action.payload,
        isLoading: false,
      };

    case VirtualStudiesActions.FETCH_VIRTUAL_STUDIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case UserActions.logout:
      return { ...initialState };

    default:
      return state;
  }
};
