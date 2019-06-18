import { initializeApi } from 'services/api';
import { fetchParticipantWithId } from 'services/arranger/participants';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

export const actionTypes = {
  FETCH_PARTICIPANT_REQUESTED: 'FETCH_PARTICIPANT_REQUESTED',
  FETCH_PARTICIPANT_FAILURE: 'FETCH_PARTICIPANT_FAILURE',
  FETCH_PARTICIPANT_SUCCESS: 'FETCH_PARTICIPANT_SUCCESS',
};

/**
 * Get a participant from arranger.
 * @param {string} participantId - the id of the particpant
 */
export const fetchParticipant = participantId => {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_PARTICIPANT_REQUESTED,
      payload: participantId,
    });

    return fetchParticipantWithId(api, participantId)
      .then(participant => {
        dispatch({
          type: actionTypes.FETCH_PARTICIPANT_SUCCESS,
          payload: participant,
        });
      })
      .catch(err => {
        dispatch({
          type: actionTypes.FETCH_PARTICIPANT_FAILURE,
          payload: err,
        });
      });
  };
};
