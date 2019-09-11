import urlJoin from 'url-join';

import { arrangerProjectId, arrangerApiRoot } from 'common/injectGlobals';
import { initializeApi } from 'services/api';
import { getErrorMessageFromResponse } from 'services/arranger';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

/**
 * Fetches a list of multiple entities by their ids, returning an object describing the matches.
 * @param {[String]} ids - an array of ids to search for.
 * @returns {Object} an object that describe the results, see example.
 *
 * @example
 *
 * data: {
 *   participants: [
 *      {
 *        participantIds: [String],
 *        search: String,
 *        type: 'PARTICIPANT' | 'BIOSPECIMEN' | 'FAMILY' | 'SAMPLE EXTERNAL ID'
 *      }
 *    ]
 *  }
 */
export const searchByIds = async ids => {
  const url = urlJoin(arrangerApiRoot, `/searchByIds`);
  const body = {
    project: arrangerProjectId,
    ids: ids,
  };

  return api({
    method: 'POST',
    url,
    body,
  }).catch(err => {
    const message = getErrorMessageFromResponse(
      err,
      `Failed to search for ids "${ids.join(', ')}"`,
    );
    throw new Error(message);
  });
};
