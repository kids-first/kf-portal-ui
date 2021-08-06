import { combineReducers } from 'redux';

import cavatica from './cavatica';
import currentVirtualStudy from './currentVirtualStudy';
import fenceConnections from './fenceConnections';
import fenceStudies from './fenceStudies';
import fileSearchFilters from './fileSearchFilters';
import genomicSuggester from './genomicSuggester';
import modal from './modal';
import profile from './profile';
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
  report,
  fileSearchFilters,
  saveSets,
  modal,
  genomicSuggester,
  workBench,
  savedQueries,
  fenceConnections,
  fenceStudies,
  profile,
  cavatica,
});
