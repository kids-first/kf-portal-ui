import { combineReducers } from 'redux';
import virtualStudies from './virtualStudies';
import currentVirtualStudy from './currentVirtualStudy';
import user from './user';
import ui from './ui';
import enableFeatures from './enableFeatures';
import modal from './modal';
import report from './report';
import fileSearchFilters from './fileSearchFilters';
import saveSets from './saveSets';
import genomicSuggester from './genomicSuggester';
import workBench from './workbench';

export default combineReducers({
  virtualStudies,
  currentVirtualStudy,
  user,
  ui,
  enableFeatures,
  report,
  fileSearchFilters,
  saveSets,
  modal,
  genomicSuggester,
  workBench,
});
