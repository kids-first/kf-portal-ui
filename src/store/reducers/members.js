import { MembersActions } from '../membersTypes';

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
    case MembersActions.REQUEST_MATCHING_LIST_OF_MEMBERS:
      return { ...state, pending: true };
    case MembersActions.RECEIVE_MATCHING_LIST_OF_MEMBERS:
      return {
        ...state,
        pending: false,
        members: action.payload.publicMembers,
        count: action.payload.count,
      };
    case MembersActions.REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR:
      return { ...state, pending: false, error: action.error };
    case MembersActions.REQUEST_ROLES_FILTER_UPDATE:
      return { ...state, rolesFilter: action.payload };
    case MembersActions.REQUEST_INTERESTS_FILTER_UPDATE:
      return { ...state, interestsFilter: action.payload };
    case MembersActions.REQUEST_ADMIN_FILTER_UPDATE:
      return { ...state, adminOptionsFilter: action.payload };
    case MembersActions.REQUEST_QUERYSTRING_UPDATE:
      return { ...state, queryString: action.payload };
    case MembersActions.REQUEST_CURRENTPAGE_UPDATE:
      return { ...state, currentPage: action.payload };
    case MembersActions.REQUEST_MEMBER_PER_PAGE_UPDATE:
      return { ...state, membersPerPage: action.payload };
    case MembersActions.REQUEST_STORE_RESET:
      return initialState;
    default:
      return state;
  }
}
