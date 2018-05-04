import advancedFacetView from './advancedFacetView';
import fileRepoContainer from './fileRepo';
import modal from './modal';
import * as uikit from './uikit';
import userDashboard, { mySavedQueries, integrations } from './userDashboard';

export default {
  ...uikit,
  ...modal,
  advancedFacetView,
  fileRepoContainer,
  mySavedQueries,
  userDashboard,
  integrations,
};
