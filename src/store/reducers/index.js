import { combineReducers } from 'redux';
import virtualStudies from './virtualStudies';
import currentVirtualStudy from './currentVirtualStudy';
import user from './user';
import ui from './ui';
import errors from './errors';
import enableFeatures from './enableFeatures';
import modal from './modal';
import report from './report';
import fileSearchFilters from './fileSearchFilters';
import saveSets from './saveSets';

export default combineReducers({
  virtualStudies,
  currentVirtualStudy,
  user,
  ui,
  errors,
  enableFeatures,
  report,
  fileSearchFilters,
  saveSets,
  modal,
});
