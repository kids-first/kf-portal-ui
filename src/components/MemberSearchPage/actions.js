import {
  REQUEST_MATCHING_LIST_OF_MEMBERS,
  RECEIVE_MATCHING_LIST_OF_MEMBERS,
  REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
  REQUEST_ROLES_FILTER_UPDATE,
  REQUEST_QUERYSTRING_UPDATE,
  REQUEST_CURRENTPAGE_UPDATE,
  REQUEST_MEMBER_PER_PAGE_UPDATE,
  REQUEST_INTERESTS_FILTER_UPDATE,
  REQUEST_STORE_RESET
} from './constants';

export const fetchMatchingListOfMembers = () => {
  return {
    type: REQUEST_MATCHING_LIST_OF_MEMBERS,
  };
};

export const receiveMatchingListOfMembers = (data = []) => {
  return {
    type: RECEIVE_MATCHING_LIST_OF_MEMBERS,
    payload: data,
  };
};

export const requestRolesFilterUpdate = (filter = {}) => {
  return {
    type: REQUEST_ROLES_FILTER_UPDATE,
    payload: filter,
  };
};

export const requestInterestsFilterUpdate = (filter = {}) => {
  return {
    type: REQUEST_INTERESTS_FILTER_UPDATE,
    payload: filter,
  };
};

export const requestQueryStringUpdate = (queryString = '') => {
  return {
    type: REQUEST_QUERYSTRING_UPDATE,
    payload: queryString,
  };
};

export const requestCurrentPageUpdate = (currentPage = 1) => {
  return {
    type: REQUEST_CURRENTPAGE_UPDATE,
    payload: currentPage,
  };
};

export const requestMemberPerPageUpdate = (memberPerPage = 10) => {
  return {
    type: REQUEST_MEMBER_PER_PAGE_UPDATE,
    payload: memberPerPage,
  };
};

export const requestError = error => {
  return {
    type: REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
    error,
  };
};

export const requestResetStore = () => {
  return {
    type: REQUEST_STORE_RESET,
    payload: null,
  };
};