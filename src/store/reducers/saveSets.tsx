import {
  FAILURE_CREATE,
  RE_INITIALIZE_STATE,
  SaveSetsActionTypes,
  SaveSetState,
  TOGGLE_PENDING_CREATE,
} from '../saveSetTypes';

const initialState: SaveSetState = {
  create: {
    isLoading: false,
    error: null,
  },
};

export default (state = initialState, action: SaveSetsActionTypes): SaveSetState => {
  switch (action.type) {
    case TOGGLE_PENDING_CREATE: {
      return {
        ...state,
        create: { ...state.create, isLoading: action.isPending },
      };
    }
    case FAILURE_CREATE: {
      return {
        ...state,
        create: { ...state.create, error: action.error },
      };
    }
    case RE_INITIALIZE_STATE: {
      return { ...state, create: initialState.create };
    }
    default:
      return state;
  }
};
