import {
  FAILURE_CREATE,
  FAILURE_LOAD_SAVE_SETS,
  RE_INITIALIZE_STATE,
  SaveSetsActionTypes,
  SaveSetState,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
  USER_SAVE_SETS,
} from '../saveSetTypes';

const initialState: SaveSetState = {
  create: {
    isLoading: false,
    error: null,
    defaultTag: 'Saved_Set_1',
  },
  userSets: {
    sets: [],
    error: null,
    isLoading: false,
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
    case TOGGLE_LOADING_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, isLoading: action.isLoading } };
    }
    case FAILURE_LOAD_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, error: action.error } };
    }
    case USER_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, sets: action.payload } };
    }
    default:
      return state;
  }
};
