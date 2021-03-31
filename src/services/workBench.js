import { kfVariantClusterUrl } from 'common/injectGlobals';
import { initializeApi } from 'services/api';

const api = initializeApi();

export const startCluster = async () =>
  await api({
    method: 'POST',
    url: kfVariantClusterUrl,
  });

export const stopCluster = async () =>
  await api({
    method: 'DELETE',
    url: kfVariantClusterUrl,
  });

export const getClusterStatus = async () =>
  await api({
    method: 'GET',
    url: kfVariantClusterUrl,
  });
