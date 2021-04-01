import { kfVariantClusterUrl } from 'common/injectGlobals';
import { initializeApi } from 'services/api';

const api = initializeApi();

export const startCluster = () =>
  api({
    method: 'POST',
    url: kfVariantClusterUrl,
  });

export const stopCluster = () =>
  api({
    method: 'DELETE',
    url: kfVariantClusterUrl,
  });

export const getClusterStatus = () =>
  api({
    method: 'GET',
    url: kfVariantClusterUrl,
  });
