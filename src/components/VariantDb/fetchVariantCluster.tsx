import { kfVariantCluster } from 'common/injectGlobals';

export const launchCluster = async (api: Function) =>
  await api({
    method: 'POST',
    url: kfVariantCluster,
  });

export const getStatus = async (api: Function) =>
  await api({
    method: 'GET',
    url: kfVariantCluster,
  });

export const deleteCluster = async (api: Function) =>
  await api({
    method: 'DELETE',
    url: kfVariantCluster,
  });
