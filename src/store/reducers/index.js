import { combineReducers } from 'redux';

import currentVirtualStudy from './currentVirtualStudy';
import enableFeatures from './enableFeatures';
import fenceConnections from './fenceConnections';
import fenceStudies from './fenceStudies';
import fileSearchFilters from './fileSearchFilters';
import genomicSuggester from './genomicSuggester';
import modal from './modal';
import queryResolver from './queryResolver';
import report from './report';
import savedQueries from './SavedQueries';
import saveSets from './saveSets';
import ui from './ui';
import user from './user';
import virtualStudies from './virtualStudies';
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
  savedQueries,
  fenceConnections,
  fenceStudies,
  queryResolver,
});
