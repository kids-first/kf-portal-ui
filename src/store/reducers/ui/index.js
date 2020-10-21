import { combineReducers } from 'redux';
import participantEntityPage from './participantEntityPage';
import memberSearchPageReducer from 'components/MemberSearchPage/reducer';

export default combineReducers({
  participantEntityPage,
  memberSearchPageReducer,
});
