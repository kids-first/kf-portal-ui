import React, { Fragment } from 'react';
import styled from 'react-emotion';

import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import { Link } from 'uikit/Core';
import QueryBlock from './QueryBlock';
//import { TealActionButton } from 'uikit/Button';

<<<<<<< HEAD
const defaultQueries = [];
<<<<<<< HEAD

const QueriesHeading = styled('h4')`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.75;
  color: ${({ theme }) => theme.greyScale1};
  margin-bottom: 7px;
  margin-top: 0;
`;
=======
>>>>>>> Add Query Block to DefaultQueries
=======
const defaultQueries = [
  {
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
  {
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
  {
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
];
>>>>>>> Add sample queries

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
    <PromptMessageContainer info my={20}>
      <PromptMessageHeading info mb={10}>
        You have no saved queries yet.
      </PromptMessageHeading>
      <PromptMessageContent>
<<<<<<< HEAD
        Explore the <Link to="/search/file">File Repository</Link> and start saving queries!
<<<<<<< HEAD
      </PromptMessageContent>
    </PromptMessageContainer>
    <QueriesHeading>Popular Queries:</QueriesHeading>
    <div>{defaultQueries.map(q => <QueryBlock key={q.id} canDelete={false} />)}</div>
        Explore the{' '}
        <Link hasExternalIcon={false} to="/search/file">
          File Repository
        </Link>{' '}
        and start saving queries!
=======
>>>>>>> Add Query Block to DefaultQueries
=======
        Explore the{' '}
        <Link to="/search/file" style={{ textDecoration: 'none' }}>
          File Repository
        </Link>{' '}
        and start saving queries!
>>>>>>> Style file repo link
      </PromptMessageContent>
    </PromptMessageContainer>
    <QueriesHeading>Examples:</QueriesHeading>
    <div>{defaultQueries.map(q => <QueryBlock key={q.id} savedTime={false} />)}</div>
  </Fragment>
);
export default DefaultSavedQueries;
