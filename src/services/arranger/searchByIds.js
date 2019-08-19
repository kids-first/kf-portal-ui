// import { get } from 'lodash';
import { arrangerProjectId } from 'common/injectGlobals';
import { initializeApi } from 'services/api';
import { getErrorMessageFromResponse } from 'services/arranger';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

export const searchByIds = async ids => {
  const body = {
    project: arrangerProjectId,
    ids: ids,
  };

  console.log('🔥 body', body);

  return api('/searchByIds', body)
    .catch(err => {
      const message = getErrorMessageFromResponse(
        err,
        `Failed to search for ids "${ids.join(', ')}"`,
      );
      throw new Error(message);
    })
    .then(data => {
      console.log('🔥 data!', data);
      // return get(data, 'data.participant.hits.edges[0].node', null);
    });
};
