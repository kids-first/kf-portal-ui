import { initializeApi } from 'services/api';
import urljoin from 'url-join';
import { reactApiSearchMembersApi } from 'common/injectGlobals';

const URL = 'http://localhost:9001';

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
        // reactApiSearchMembersApi,
        URL,
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
