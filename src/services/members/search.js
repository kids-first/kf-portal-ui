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

export const getAllMembers = async () => {
  return downloader({
    url: 'http://localhost:3232/userList',
    method: 'GET',
    responseType: 'blob',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE1ODA0MDk3NDQsImV4cCI6MTU4MDQ5NjE0NCwic3ViIjoiYWRkNzQxMDItMjRmOS00YTZjLThjYzEtZWRlMTM5NGQ3MGJmIiwiaXNzIjoiZWdvIiwiYXVkIjpbXSwianRpIjoiNDgzZGQ1MTgtOWJhOC00NjFiLWE3YmYtZWQ0OWUxYjk5OTdjIiwiY29udGV4dCI6eyJ1c2VyIjp7Im5hbWUiOiJhZHJpYW5wYXVsY2h1QGdtYWlsLmNvbSIsImVtYWlsIjoiYWRyaWFucGF1bGNodUBnbWFpbC5jb20iLCJzdGF0dXMiOiJBcHByb3ZlZCIsImZpcnN0TmFtZSI6IkFkcmlhbiIsImxhc3ROYW1lIjoiUGF1bCIsImNyZWF0ZWRBdCI6IjIwMTktMTItMDYgMDg6MTg6MTUiLCJsYXN0TG9naW4iOiIyMDIwLTAxLTMwIDA2OjQyOjI0IiwicHJlZmVycmVkTGFuZ3VhZ2UiOm51bGwsInJvbGVzIjpbIkFETUlOIl0sImdyb3VwcyI6W10sInBlcm1pc3Npb25zIjpbXX19fQ.EnEAohua4s-7JE7nI4rdOXhVEFYx28bTWn3DQ1bmgsnHeXeS-U99MvP8I-hdlZV0nS70WbVcoYEEYLi3tmscLjBMBurdePSfLr7PtS_7fOgErL_KKCXHnsiDV9MQHU2SLPBBITgyCvbT45-Uxkm5W4TkoWMsyGtfLwZWKNm9cQuQBK-ZANPEErVJ1W4rRkPX-_lkdnu4F8H7cln8veCdvMqNc7msaBxS3U407KxQcJPH1Qy5TzAu5VKLp-AGe8jN13I2S4p60f-duN_P_D6JY77UxAHdhL0a6Zl2TAtUlSz4alcwmGTLkgOQxcxT63VHUszNFAKEBfUiXeG5X1CTpw',
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
