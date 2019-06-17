import { SET_ACTIVE_VIEW } from '../actionTypes';

export const setActiveView = activeView => ({
  type: SET_ACTIVE_VIEW,
  payload: activeView,
});
