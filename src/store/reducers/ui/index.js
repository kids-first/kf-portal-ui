import { combineReducers } from 'redux';
import participantEntityPage from './participantEntityPage';
import cohortBuilderPage from './cohortBuilderPage';

export default combineReducers({
  participantEntityPage,
  cohortBuilderPage,
});
