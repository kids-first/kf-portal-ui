import { combineReducers } from 'redux';

import cavatica from './cavatica';
import currentVirtualStudy from './currentVirtualStudy';
import fenceConnections from './fenceConnections';
import fenceStudies from './fenceStudies';
import fileSearchFilters from './fileSearchFilters';
import genomicSuggester from './genomicSuggester';
import members from './members';
import modal from './modal';
import participantEntity from './participantEntity';
import profile from './profile';
import queryResolver from './queryResolver';
import report from './report';
import savedQueries from './SavedQueries';
import saveSets from './saveSets';
import user from './user';
import virtualStudies from './virtualStudies';
import workBench from './workbench';

export default combineReducers({
  virtualStudies,
  currentVirtualStudy,
  user,
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
  profile,
  cavatica,
  members,
  participantEntity,
});
