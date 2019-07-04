export const actionTypes = {
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
};

export const setActiveView = activeView => ({
  type: actionTypes.SET_ACTIVE_VIEW,
  payload: activeView,
});
