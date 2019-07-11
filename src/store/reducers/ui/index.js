import { combineReducers } from 'redux';
import participantEntityPage from './participantEntityPage';
import cohortBuilderPage from './cohortBuilderPage';
import userDashboardPage from './userDashboardPage';

export default combineReducers({
  participantEntityPage,
  cohortBuilderPage,
  userDashboardPage,
});
