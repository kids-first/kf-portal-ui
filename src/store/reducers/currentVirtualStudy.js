import cloneDeep from 'lodash/cloneDeep';

import {
  addSetToActiveQuery,
  createNewQueryFromSetId,
  getDefaultSqon,
  isDefaultSqon,
} from 'common/sqonUtils';
import { addFieldToActiveQuery } from 'common/sqonUtils';
import { SetsActions } from 'store/saveSetTypes';
import { UserActions } from 'store/userTypes';

import { VirtualStudiesActions } from '../virtualStudiesTypes';

export const initialState = {
  sqons: getDefaultSqon(),
  selectionSqon: null,
  activeIndex: 0,
  uid: null,
  virtualStudyId: null,
  name: '',
  description: '',
  dirty: false,
  areSqonsEmpty: true,
  isLoading: false,
  error: null,
};

const currySetState = (state) => (diff = {}) => {
  const newState = { ...state, ...diff };
  newState.areSqonsEmpty = isDefaultSqon(newState.sqons);
  return newState;
};

const resetState = (diff = {}) => {
  const newState = {
    ...cloneDeep(initialState),
    ...diff,
  };
  newState.areSqonsEmpty = isDefaultSqon(newState.sqons);
  return newState;
};

export default (state = initialState, action) => {
  const setState = currySetState(state);
  switch (action.type) {
    case VirtualStudiesActions.VIRTUAL_STUDY_LOAD_REQUESTED:
      return resetState({
        isLoading: true,
      });
    case VirtualStudiesActions.VIRTUAL_STUDY_LOAD_SUCCESS:
      return resetState({
        ...action.payload,
        isLoading: false,
      });
    case VirtualStudiesActions.VIRTUAL_STUDY_LOAD_FAILURE:
      return setState({
        error: action.payload,
        isLoading: false,
      });

    case VirtualStudiesActions.VIRTUAL_STUDY_RESET:
      return resetState();

    case VirtualStudiesActions.VIRTUAL_STUDY_SAVE_REQUESTED:
      return state;
    case VirtualStudiesActions.VIRTUAL_STUDY_SAVE_SUCCESS:
      return setState({
        ...action.payload,
        dirty: false,
        areSqonsEmpty: false,
      });
    case VirtualStudiesActions.VIRTUAL_STUDY_SAVE_FAILURE:
      return setState({
        error: action.payload,
      });

    case VirtualStudiesActions.VIRTUAL_STUDY_DELETE_REQUESTED:
      return setState({
        isLoading: true,
      });
    case VirtualStudiesActions.VIRTUAL_STUDY_DELETE_SUCCESS:
      return resetState();
    case VirtualStudiesActions.VIRTUAL_STUDY_DELETE_FAILURE:
      return setState({
        error: action.payload,
        isLoading: false,
      });

    case VirtualStudiesActions.SET_ACTIVE_INDEX:
      return setState({
        dirty: true,
        activeIndex: action.payload,
      });

    case VirtualStudiesActions.SET_SQONS:
      return setState({
        dirty: true,
        sqons: action.payload,
      });

    case VirtualStudiesActions.SET_SELECTION_SQONS:
      return setState({
        selectionSqon: action.payload,
      });

    case VirtualStudiesActions.SET_VIRTUAL_STUDY_ID:
      return setState({
        dirty: true,
        virtualStudyId: action.payload,
      });

    case SetsActions.CREATE_SET_QUERY_REQUEST: {
      const newSqons = createNewQueryFromSetId(action.setId, state.sqons);
      return setState({
        sqons: newSqons,
        activeIndex: newSqons.length - 1,
      });
    }
    case UserActions.logout:
      return cloneDeep(initialState);

    case VirtualStudiesActions.VIRTUAL_STUDY_CLEAN_ERROR:
      return setState({
        error: null,
      });

    case SetsActions.ADD_SET_TO_CURRENT_QUERY: {
      const { activeIndex, sqons } = state;
      const newSqons = addSetToActiveQuery({
        setId: action.setId,
        querySqons: sqons,
        activeIndex,
      });
      return setState({ sqons: newSqons, activeIndex });
    }

    case VirtualStudiesActions.ADD_TERM_TO_CURRENT_VIRTUAL_STUDY: {
      const { activeIndex, sqons } = state;
      const newSqons = addFieldToActiveQuery({
        term: action.payload.term,
        sqonOp: action.payload.sqonOp,
        querySqons: sqons,
        activeIndex: activeIndex,
      });
      return setState({ sqons: newSqons });
    }
    default:
      return state;
  }
};
