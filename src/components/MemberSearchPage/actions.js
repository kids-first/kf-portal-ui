import {
  REQUEST_MATCHING_LIST_OF_MEMBERS,
  RECEIVE_MATCHING_LIST_OF_MEMBERS,
  RECEIVE_TOTAL_MEMBERS_COUNT,
  REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
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

export const receiveTotalMemberCount = (data = []) => {
  return {
    type: RECEIVE_TOTAL_MEMBERS_COUNT,
    payload: data,
  };
};

export const requestError = error => {
  return {
    type: REQUEST_MATCHING_LIST_OF_MEMBERS_ERROR,
    error,
  };
};
