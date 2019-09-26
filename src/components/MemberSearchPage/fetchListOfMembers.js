import { fetchMatchingListOfMembers, receiveMatchingListOfMembers, requestError } from './actions';
import searchMembers from 'services/members/search';

export const fetchListOfMembers = (searchInput = '', searchParams) => {
  return async dispatch => {
    dispatch(fetchMatchingListOfMembers());
    try {
      const response = await searchMembers(searchInput, searchParams);
      if (response.err) {
        throw response.err;
      }
      dispatch(receiveMatchingListOfMembers(response.data));
    } catch (err) {
      dispatch(requestError(err));
    }
  };
};
