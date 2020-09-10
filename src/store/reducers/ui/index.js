import { combineReducers } from 'redux';
import participantEntityPage from './participantEntityPage';
import modalComponent from './modalComponent';
import memberSearchPageReducer from 'components/MemberSearchPage/reducer';

export default combineReducers({
  participantEntityPage,
  modalComponent,
  memberSearchPageReducer,
});
