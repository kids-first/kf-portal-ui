import { combineReducers } from 'redux';
import participantEntityPage from './participantEntityPage';
import cohortBuilderPage from './cohortBuilderPage';
import modalComponent from './modalComponent';
import memberSearchPageReducer from 'components/MemberSearchPage/reducer';

export default combineReducers({
  participantEntityPage,
  cohortBuilderPage,
  modalComponent,
  memberSearchPageReducer,
});
