import urlJoin from 'url-join';

import { arrangerApiRoot } from 'common/injectGlobals';
import { initializeApi } from 'services/api';

export const fetchPublicStats = async () => {
  const api = initializeApi();
  return api({
    url: urlJoin(arrangerApiRoot, '/statistics'),
    body: null,
    method: 'GET',
  });
};
