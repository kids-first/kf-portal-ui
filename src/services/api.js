import { arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import ajax from './ajax';

const initializeApi = ({ onUnauthorized }) => ({ endpoint = '', body, headers }) => {
  const url = urlJoin(arrangerApiRoot, endpoint);

  return ajax
    .post(url, body)
    .then(response => response.data)
    .catch(({ response }) => {
      if (response.status === 401) {
        return onUnauthorized(response);
      }
    });
};
export default initializeApi;
