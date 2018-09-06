import urlJoin from 'url-join';
import sqonToName from 'common/sqonToName';
import { shortUrlApi } from 'common/injectGlobals';
import { EXAMPLE_QUERIES } from 'common/constants';

const riffQuery = ({
  stats,
  queryName,
  sqon,
  loggedInUser,
  api,
  url,
  sharedPublicly = false,
  example = false,
}) => {
  let { Files, Participants, Families, Size } = stats;
  let alias = queryName || sqonToName({ filters: sqon });

  return api({
    url: urlJoin(shortUrlApi, 'shorten'),
    body: JSON.stringify({
      userid: (loggedInUser || {}).egoId || 'anonymous',
      alias,
      sharedPublicly,
      content: {
        ...stats,
        example: example,
        longUrl: url,
        'og:title': `Kids First: ${alias}`,
        'og:description': `${Files} Files, ${Participants} Participants, ${Families} Families, ${Size} Size`,
        'og:image':
          'https://d3b.center/wp-content/uploads/2018/01/Kids-First-Hero-image-01-2-2000x500.png',
        'twitter:label1': 'Test Label',
        'twitter:data1': 'test data',
      },
    }),
  });
};

export default riffQuery;

export const createExampleQueries = (api, egoId) =>
  Promise.all(EXAMPLE_QUERIES.map(q => riffQuery({ ...q, api, egoId })));
