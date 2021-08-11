import { SaveSetState, SetsActions, SetsActionTypes, UserSet } from '../saveSetTypes';
import { LogoutAction, UserActions } from '../userTypes';

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
    isEditing: false,
  },
};

const removeSets = (currentSets: UserSet[], setIdsToRemove: string[]) =>
  currentSets.filter((set) => !setIdsToRemove.includes(set.setId));

const editSaveSetTag = (currentSets: UserSet[], setId: string, tag: string) =>
  currentSets.map((s) => (s.setId === setId ? { ...s, tag: tag } : s));

export default (state = initialState, action: SetsActionTypes | LogoutAction): SaveSetState => {
  switch (action.type) {
    case SetsActions.TOGGLE_PENDING_CREATE: {
      return {
        ...state,
        create: { ...state.create, isLoading: action.isPending },
      };
    }
    case SetsActions.FAILURE_CREATE: {
      return {
        ...state,
        create: { ...state.create, error: action.error },
      };
    }
    case SetsActions.RE_INITIALIZE_STATE: {
      return { ...state, create: initialState.create };
    }
    case SetsActions.TOGGLE_LOADING_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, isLoading: action.isLoading } };
    }
    case SetsActions.FAILURE_LOAD_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, error: action.error } };
    }
    case SetsActions.USER_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, sets: action.payload } };
    }
    case SetsActions.TOGGLE_IS_DELETING_SAVE_SETS: {
      return { ...state, userSets: { ...state.userSets, isDeleting: action.isDeleting } };
    }
    case SetsActions.EDIT_SAVE_SET_TAG: {
      return {
        ...state,
        userSets: {
          ...state.userSets,
          sets: editSaveSetTag(state.userSets.sets, action.set.key, action.set.name),
        },
      };
    }
    case SetsActions.TOGGLE_IS_ADD_DELETE_TO_SET: {
      return { ...state, userSets: { ...state.userSets, isEditing: action.isEditing } };
    }
    case SetsActions.REMOVE_USER_SAVE_SETS: {
      return {
        ...state,
        userSets: { ...state.userSets, sets: removeSets(state.userSets.sets, action.sets) },
      };
    }
    case UserActions.logout: {
      return { ...initialState };
    }
    default:
      return state;
  }
};
