import { kfVariantClusterUrl } from 'common/injectGlobals';
import { initializeApi } from 'services/api';
import { UnAuthorizedClusterError } from 'store/WorkBenchTypes';

const api = initializeApi({
  onUnauthorized: (err) =>
    Promise.reject(new UnAuthorizedClusterError(err.data?.code ?? err.message)),
});

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
