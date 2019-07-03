import { combineReducers } from 'redux';

import virtualStudies from './virtualStudies';
import cohortBuilder from './cohortBuilder';
import user from './user';
import ui from './ui';

export default combineReducers({
  virtualStudies,
  cohortBuilder,
  user,
  ui,
});
