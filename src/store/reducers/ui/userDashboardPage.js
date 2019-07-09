import { actionTypes } from '../../../components/UserDashboard/actionCreators';

const initialState = {
  activeSavedQueryTab: 'PARTICIPANTS',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_SAVED_QUERY_TAB:
      return {
        ...state,
        activeSavedQueryTab: action.payload,
      };
    default:
      return state;
  }
};
