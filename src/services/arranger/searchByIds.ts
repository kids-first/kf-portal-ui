import urlJoin from 'url-join';

import { arrangerApiProjectId, kfArrangerApiRoot } from 'common/injectGlobals';
import { initializeApi } from 'services/api';

const api = initializeApi({
  onError: (e) => {
    console.error(e);
    return Promise.reject(e);
  },
  onUnauthorized: () => {
    console.warn('Unauthorized');
  },
  defaultHeaders: {},
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
export const searchByIds = async (ids: string[]) => {
  const url = urlJoin(kfArrangerApiRoot, `/searchByIds`);
  const body = {
    project: arrangerApiProjectId,
    ids: ids,
  };

  return api({
    method: 'POST',
    url,
    body,
  });
};
