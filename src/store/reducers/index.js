import { combineReducers } from 'redux';

import virtualStudies from './virtualStudies';
import user from './user';

export default combineReducers({
  virtualStudies,
  user,
});
