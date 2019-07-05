import { actionTypes } from 'components/CohortBuilder/actionCreators';

const initialState = {
  activeView: 'summary',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_VIEW:
      return {
        ...state,
        activeView: action.payload,
      };
    default:
      return state;
  }
};
