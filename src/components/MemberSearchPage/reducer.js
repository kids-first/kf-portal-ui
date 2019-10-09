import {
  RECEIVE_MATCHING_LIST_OF_MEMBERS,
  REQUEST_MATCHING_LIST_OF_MEMBERS,
  REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
  RECEIVE_TOTAL_MEMBERS_COUNT,
} from './constants';

const initialState = {
  members: [],
  totalCount: 0,
  isFetching: false,
  errors: null,
};

export default function memberSearchPageReducer (state = initialState, action) {
  switch (action.type) {
    case REQUEST_MATCHING_LIST_OF_MEMBERS:
      return { ...state, isFetching: true };
    case RECEIVE_MATCHING_LIST_OF_MEMBERS:
      return { ...state, isFetching: false, members: action.payload };
    case RECEIVE_TOTAL_MEMBERS_COUNT:
      return { ...state, isFetching: false, totalCount: action.payload };
    case REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR:
      return { ...state, isFetching: false, error: action.error };
    default:
      return state;
  }
}