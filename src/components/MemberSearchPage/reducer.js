import {
  RECEIVE_MATCHING_LIST_OF_MEMBERS,
  REQUEST_MATCHING_LIST_OF_MEMBERS,
  REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
} from './constants';

const initialState = {
  members: [],
  count: {

  },
  pending: false,
  errors: null,
};

export default function memberSearchPageReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_MATCHING_LIST_OF_MEMBERS:
      return { ...state, pending: true };
    case RECEIVE_MATCHING_LIST_OF_MEMBERS:
      return {
        ...state,
        pending: false,
        members: action.payload.publicMembers,
        count: action.payload.count,
      };
    case REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR:
      return { ...state, pending: false, error: action.error };
    default:
      return state;
  }
}
