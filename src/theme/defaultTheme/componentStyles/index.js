import advancedFacetView from './advancedFacetView';
import fileRepoContainer from './fileRepo';
import modal from './modal';
import * as uikit from './uikit';
import userDashboard, {
  mySavedQueries,
  integrations,
  completionWrapper,
  shareQuery,
  shareQueryTooltipContent,
} from './userDashboard';

export default {
  ...uikit,
  ...modal,
  advancedFacetView,
  fileRepoContainer,
  mySavedQueries,
  userDashboard,
  integrations,
  completionWrapper,
  shareQuery,
  shareQueryTooltipContent,
};
