import { fetchMatchingListOfMembers, receiveMatchingListOfMembers, requestError } from './actions';
import { searchMembers } from 'services/members/search';

const fetchListOfMembers = (searchInput = '', searchParams) => {
  return async dispatch => {
    dispatch(fetchMatchingListOfMembers());
    try {
      const response = await searchMembers(searchInput, searchParams);
      if (response.err) {
        throw response.err;
      }
      dispatch(receiveMatchingListOfMembers(response));
    } catch (err) {
      dispatch(requestError(err));
    }
  };
};

export default fetchListOfMembers;
