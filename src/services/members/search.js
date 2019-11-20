import { initializeApi } from 'services/api';
import urljoin from 'url-join';
import { reactApiSearchMembersApi } from 'common/injectGlobals';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

export const searchMembers = async (searchTerm, searchParams) => {
  const { start = 0, end = 50, roles = [], interests = [] } = searchParams;
  let response;
  try {
    response = await api({
      method: 'GET',
      url: urljoin(
        reactApiSearchMembersApi,
        'searchmembers',
        `?queryString=${searchTerm}&start=${start}&end=${end}${roles
          .map(role => `&role=${role}`).join('')}${interests
          .map(interest => `&interest=${interest}`).join('')
        }`,
      ),
    });
  } catch (err) {
    throw new Error(err);
  }
  return response;
};
