import ajax from 'services/ajax';
import { secretStorageApiRoot } from 'common/injectGlobals';

export const getSecret = async ({ service }) => {
  console.log(service);
  const { data } = await ajax.get(secretStorageApiRoot, {
    params: { service },
  });
  return data;
};

export const deleteSecret = async ({ service }) => {
  const { data } = await ajax.delete(secretStorageApiRoot, { data: { service } });
  return data;
};

export const setSecret = async ({ service, secret }) => {
  const { data } = await ajax.put(secretStorageApiRoot, { service, secret });
  return data;
};
