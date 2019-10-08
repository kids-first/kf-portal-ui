import { initializeApi } from 'services/api';
import urljoin from 'url-join';

const MEMBERS_SERVICE_ROOT_URL = 'https://api-search-members-qa.kidsfirstdrc.org';

const api = initializeApi({
  onError: console.err,
  onUnauthorized: response => {
    console.warn('Unauthorized', response);
  },
});

export const searchMembers = async (searchTerm, searchParams) => {
  const { start = 0, end = 50 } = searchParams;
  let response;
  try {
    response = await api({
      method: 'GET',
      url: urljoin(
        MEMBERS_SERVICE_ROOT_URL,
        'searchmembers',
        `?queryString=${searchTerm}&start=${start}&end=${end}`,
      ),
    });
  } catch (err) {
    throw new Error(err);
  }
  return response;
};
