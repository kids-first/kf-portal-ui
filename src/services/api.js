import { arrangerApiRoot } from 'common/injectGlobals';
import urlJoin from 'url-join';
import ajax from './ajax';

const initializeApi = ({ onUnauthorized }) => async ({
  method = 'post',
  endpoint = '',
  body,
  headers,
  url,
}) => {
  const uri = url || urlJoin(arrangerApiRoot, endpoint);

  return ajax[method.toLowerCase()](uri, body)
    .then(response => {
      console.log('response: ', response);
      return response.data;
    })
    .catch(({ response }) => {
      console.log('error response: ', response);
      if (response.status === 401) {
        return onUnauthorized(response);
      }
    });
};
export default initializeApi;
