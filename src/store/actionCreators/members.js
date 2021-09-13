import { searchMembers } from 'services/members/search';

import { MembersActions } from '../membersTypes';

export const fetchMatchingListOfMembers = () => ({
  type: MembersActions.REQUEST_MATCHING_LIST_OF_MEMBERS,
});

export const receiveMatchingListOfMembers = (data = []) => ({
  type: MembersActions.RECEIVE_MATCHING_LIST_OF_MEMBERS,
  payload: data,
});

export const requestRolesFilterUpdate = (filter = {}) => ({
  type: MembersActions.REQUEST_ROLES_FILTER_UPDATE,
  payload: filter,
});

export const requestInterestsFilterUpdate = (filter = {}) => ({
  type: MembersActions.REQUEST_INTERESTS_FILTER_UPDATE,
  payload: filter,
});

export const requestADMINOptionsUpdate = (filter = {}) => ({
  type: MembersActions.REQUEST_ADMIN_FILTER_UPDATE,
  payload: filter,
});

export const requestQueryStringUpdate = (queryString = '') => ({
  type: MembersActions.REQUEST_QUERYSTRING_UPDATE,
  payload: queryString,
});

export const requestCurrentPageUpdate = (currentPage = 1) => ({
  type: MembersActions.REQUEST_CURRENTPAGE_UPDATE,
  payload: currentPage,
});

export const requestMemberPerPageUpdate = (memberPerPage = 10) => ({
  type: MembersActions.REQUEST_MEMBER_PER_PAGE_UPDATE,
  payload: memberPerPage,
});

export const requestError = (error) => ({
  type: MembersActions.REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
  error,
});

export const requestResetStore = () => ({
  type: MembersActions.REQUEST_STORE_RESET,
  payload: null,
});

export const fetchListOfMembers = (searchInput = '', searchParams) => async (dispatch) => {
  dispatch(fetchMatchingListOfMembers());
  try {
    const response = await searchMembers(searchInput, searchParams);
    dispatch(receiveMatchingListOfMembers(response));
  } catch (err) {
    dispatch(requestError(err));
  }
};
