import { fetchParticipantWithId } from 'services/arranger/participants';

import { ParticipantEntityActions } from '../participantEntityTypes';

export const fetchParticipant = (api, participantId) => (dispatch) => {
  dispatch({
    type: ParticipantEntityActions.FETCH_PARTICIPANT_REQUESTED,
    payload: participantId,
  });

  return fetchParticipantWithId(api, participantId)
    .then((participant) => {
      dispatch({
        type: ParticipantEntityActions.FETCH_PARTICIPANT_SUCCESS,
        payload: participant,
      });
    })
    .catch((err) => {
      dispatch({
        type: ParticipantEntityActions.FETCH_PARTICIPANT_FAILURE,
        payload: err,
      });
    });
};
