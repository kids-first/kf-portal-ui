import React, { Fragment } from 'react';
import styled from 'react-emotion';

import { Link } from 'uikit/Core';
import QueryBlock from './QueryBlock';
//import { TealActionButton } from 'uikit/Button';

const defaultQueries = [
  {
    id: '27',
    uid: '13a0ae75-8d7f-4852-b958-2aecb84a6c3f',
    content: {
      Files: 3999,
      Participants: 1333,
      Families: 480,
      Size: '100.93 TB',
      longUrl:
        'https://portal.kidsfirstdrc.org/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.study.short_name%22%2C%22value%22%3A%5B%22Orofacial%20Cleft%3A%20European%20Ancestry%22%5D%7D%7D%5D%7D',
      'og:title': 'Kids First: Orofacial Cleft: European Ancestry',
      'og:description': '3999 Files, 1333 Participants, 480 Families, 100.93 TB Size',
      'og:image':
        'https://d3b.center/wp-content/uploads/2018/01/Kids-First-Hero-image-01-2-2000x500.png',
      'twitter:label1': 'Test Label',
      'twitter:data1': 'test data',
    },
    alias: 'Orofacial Cleft: European Ancestry',
    sharedPublicly: false,
    creationDate: '2018-07-25T15:42:49.761+0000',
    updatedDate: '2018-07-25T15:42:49.761+0000',
  },
];

const QueriesHeading = styled('h4')`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.75;
  color: ${({ theme }) => theme.greyScale1};
  margin-bottom: 7px;
  margin-top: 0;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
`;

const DefaultSavedQueries = () => (
  <Fragment>
    <QueriesHeading>Examples:</QueriesHeading>
    <div>
      {defaultQueries.filter(q => q.content.sample).map(q => {
        q.link = `/search${q.content.longUrl.split('/search')[1]}`;
        return <QueryBlock key={q.id} query={q} savedTime={false} />;
      })}
    </div>
  </Fragment>
);
export default DefaultSavedQueries;
