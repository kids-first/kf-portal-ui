import { combineReducers } from 'redux';
import participantEntityPage from './participantEntityPage';
import cohortBuilderPage from './cohortBuilderPage';
import userDashboardPage from './userDashboardPage';
import modalComponent from './modalComponent';

export default combineReducers({
  participantEntityPage,
  cohortBuilderPage,
  userDashboardPage,
  modalComponent,
});
