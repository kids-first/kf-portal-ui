import { fetchMatchingListOfMembers, receiveMatchingListOfMembers, requestError } from './actions';
import { searchMembers } from 'services/members/search';
import { receiveTotalMemberCount } from 'components/MemberSearchPage/actions';

const fetchListOfMembers = (searchInput = '', searchParams) => {
  return async dispatch => {
    dispatch(fetchMatchingListOfMembers());
    try {
      const response = await searchMembers(searchInput, searchParams);
      if (response.err) {
        throw response.err;
      }
      dispatch(receiveMatchingListOfMembers(response.publicMembers));
      dispatch(receiveTotalMemberCount(response.totalMemberCount));
    } catch (err) {
      dispatch(requestError(err));
    }
  };
};

export default fetchListOfMembers;
