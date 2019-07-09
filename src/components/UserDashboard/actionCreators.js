export const actionTypes = {
  SET_ACTIVE_SAVED_QUERY_TAB: 'SET_ACTIVE_SAVED_QUERY_TAB',
};

export const setActiveSavedQueryTab = activeSavedQueryTab => ({
  type: actionTypes.SET_ACTIVE_SAVED_QUERY_TAB,
  payload: activeSavedQueryTab,
});
