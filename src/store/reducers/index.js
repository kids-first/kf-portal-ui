import { combineReducers } from 'redux';

import virtualStudies from './virtualStudies';
import cohortBuilder from './cohortBuilder';
import user from './user';

export default combineReducers({
  virtualStudies,
  cohortBuilder,
  user,
});
