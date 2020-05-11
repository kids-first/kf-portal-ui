import { kfVariantClusterUrl } from 'common/injectGlobals';

export const launchCluster = async (api: Function) =>
  await api({
    method: 'POST',
    url: kfVariantClusterUrl,
  });

export const getStatus = async (api: Function) =>
  await api({
    method: 'GET',
    url: kfVariantClusterUrl,
  });

export const deleteCluster = async (api: Function) =>
  await api({
    method: 'DELETE',
    url: kfVariantClusterUrl,
  });
