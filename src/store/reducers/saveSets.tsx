import {
  FAILURE_CREATE,
  FAILURE_LOAD_SAVE_SETS,
  RE_INITIALIZE_STATE,
  REMOVE_USER_SAVE_SETS,
  SaveSetsActionTypes,
  SaveSetState,
  TOGGLE_IS_DELETING_SAVE_SETS,
  TOGGLE_LOADING_SAVE_SETS,
  TOGGLE_PENDING_CREATE,
  USER_SAVE_SETS,
  UserSaveSets,
} from '../saveSetTypes';

const initialState: SaveSetState = {
  create: {
    isLoading: false,
    error: null,
  },
  userSets: {
    sets: [],
    error: null,
    isLoading: false,
    isDeleting: false,
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
    case TOGGLE_IS_DELETING_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, isDeleting: action.isDeleting } };
    }
    case REMOVE_USER_SAVE_SETS: {
      return {
        ...state,
        userSets: { ...state.userSets, sets: removeSets(state.userSets.sets, action.sets) },
      };
    }
    default:
      return state;
  }
};

const removeSets = (currentSets: UserSaveSets[], setIdsToRemove: string[]) =>
  currentSets.filter((set) => !setIdsToRemove.includes(set.setId));
