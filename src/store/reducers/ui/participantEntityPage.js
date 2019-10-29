import { actionTypes } from 'components/EntityPage/Participant/actionCreators';

const initialState = {
  isLoading: false,
  error: null,
  participantId: null,
  participant: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PARTICIPANT_REQUESTED:
      return {
        ...state,
        isLoading: true,
        error: null,
        participant: null,
        participantId: action.payload,
      };
    case actionTypes.FETCH_PARTICIPANT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        participant: action.payload,
      };
    case actionTypes.FETCH_PARTICIPANT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
