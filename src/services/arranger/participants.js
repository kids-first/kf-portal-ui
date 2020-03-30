import get from 'lodash/get';
import graphql, { buildSqonForIds, getErrorMessageFromResponse } from 'services/arranger';
import participantQuery from './participantEntityQuery';

export const fetchParticipantWithId = async (api, participantId) => {
  const sqon = buildSqonForIds([participantId]);
  return graphql(api)({
    query: participantQuery,
    variables: { sqon },
  })
    .catch(err => {
      const message = getErrorMessageFromResponse(
        err,
        `Failed to fetch participant with _id "${participantId}"`,
      );
      throw new Error(message);
    })
    .then(data => {
      return get(data, 'data.participant.hits.edges[0].node', null);
    });
};
