import {
  RECEIVE_MATCHING_LIST_OF_MEMBERS,
  REQUEST_MATCHING_LIST_OF_MEMBERS,
  REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
  REQUEST_ROLES_FILTER_UPDATE,
  REQUEST_QUERYSTRING_UPDATE,
  REQUEST_CURRENTPAGE_UPDATE,
  REQUEST_MEMBER_PER_PAGE_UPDATE,
  REQUEST_INTERESTS_FILTER_UPDATE,
  REQUEST_ADMIN_FILTER_UPDATE,
  REQUEST_STORE_RESET,
} from './constants';

const initialState = {
  members: [],
  count: {},
  pending: false,
  errors: null,
  rolesFilter: {},
  interestsFilter: {},
  queryString: '',
  currentPage: 1,
  membersPerPage: 10,
  adminOptionsFilter: {},
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
    case REQUEST_ROLES_FILTER_UPDATE:
      return { ...state, rolesFilter: action.payload };
    case REQUEST_INTERESTS_FILTER_UPDATE:
      return { ...state, interestsFilter: action.payload };
    case REQUEST_ADMIN_FILTER_UPDATE:
      return { ...state, adminOptionsFilter: action.payload };
    case REQUEST_QUERYSTRING_UPDATE:
      return { ...state, queryString: action.payload };
    case REQUEST_CURRENTPAGE_UPDATE:
      return { ...state, currentPage: action.payload };
    case REQUEST_MEMBER_PER_PAGE_UPDATE:
      return { ...state, membersPerPage: action.payload };
    case REQUEST_STORE_RESET:
      return initialState;
    default:
      return state;
  }
}
