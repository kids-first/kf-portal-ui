import {
  FileSearchFiltersActionTypes,
  FileSearchFiltersState,
  TOGGLE_LOADING,
  FAILURE,
  RE_INITIALIZE_STATE,
  EntityName,
} from '../fileSearchFiltersTypes';

const initialState: FileSearchFiltersState = {
  [EntityName.PARTICIPANT]: {
    isLoading: false,
    error: null,
  },
  [EntityName.BIOSPECIMEN]: {
    isLoading: false,
    error: null,
  },
  [EntityName.FILE]: {
    isLoading: false,
    error: null,
  },
};

const getSubStateForEntity = (state: FileSearchFiltersState, entityName: EntityName) =>
  state[entityName];

export default (
  state = initialState,
  action: FileSearchFiltersActionTypes,
): FileSearchFiltersState => {
  const entityName = action.entityName;
  const subState = getSubStateForEntity(state, entityName);
  switch (action.type) {
    case TOGGLE_LOADING: {
      return { ...state, [entityName]: { ...subState, isLoading: action.isLoading } };
    }
    case FAILURE: {
      return { ...state, [entityName]: { ...subState, error: action.error } };
    }
    case RE_INITIALIZE_STATE: {
      return { ...state, [entityName]: initialState[entityName] };
    }
    default:
      return state;
  }
};
