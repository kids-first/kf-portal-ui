import urlJoin from 'url-join';
import sqonToName from 'common/sqonToName';
import { shortUrlApi } from 'common/injectGlobals';

export default ({ stats, queryName, sqon }) => {
  // TODO: user / token stuff
  let { Files, Participants, Families, Size } = stats;
  // TODO: use ajax service?

  let alias = queryName || sqonToName({ filters: sqon });
  return fetch(urlJoin(shortUrlApi, 'shorten'), {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      userid: 'dev',
      alias,
      content: {
        ...stats,
        longUrl: window.location.href,
        'og:title': `Kids First: ${alias}`,
        'og:description': `${Files} Files, ${Participants} Participants, ${Families} Families, ${Size} Size`,
        'og:image':
          'https://d3b.center/wp-content/uploads/2018/01/Kids-First-Hero-image-01-2-2000x500.png',
        'twitter:label1': 'Test Label',
        'twitter:data1': 'test data',
      },
    }),
  }).then(r => r.json());
};
