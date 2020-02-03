import { initializeApi } from 'services/api';
import urljoin from 'url-join';
import { reactApiSearchMembersApi, personaApiRoot } from 'common/injectGlobals';
import downloader from '../../common/downloader';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

const enhanceWithFilter = (filters, filterType) => {
  return filters.map(filter => `&${filterType}=${filter}`).join('');
};

export const searchMembers = async (searchTerm, searchParams) => {
  const { start = 0, end = 50, roles = [], interests = [] } = searchParams;
  let response;
  try {
    response = await api({
      method: 'GET',
      url: urljoin(
        reactApiSearchMembersApi,
        'searchmembers',
        `?queryString=${searchTerm}&start=${start}&end=${end}${enhanceWithFilter(
          roles,
          'role',
        )}${enhanceWithFilter(interests, 'interest')}
        `,
      ),
    });
  } catch (err) {
    throw new Error(err);
  }
  return response;
};

export const getAllMembers = async token => {
  return downloader({
    url: urljoin(personaApiRoot, 'userList'),
    method: 'GET',
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
};

export const searchInterests = async searchTerm => {
  try {
    return await api({
      method: 'GET',
      url: urljoin(
        reactApiSearchMembersApi,
        'interests',
        `?queryString=${searchTerm}
        `,
      ),
    });
  } catch (err) {
    throw new Error(err);
  }
};
