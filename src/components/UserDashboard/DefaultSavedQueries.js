import React, { Fragment } from 'react';
import styled from 'react-emotion';

import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import { Link } from 'uikit/Core';
import QueryBlock from './QueryBlock';

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

const DefaultSavedQueries = () => (
  <Fragment>
    <PromptMessageContainer info my={20}>
      <PromptMessageHeading info mb={10}>
        You have no saved queries yet.
      </PromptMessageHeading>
      <PromptMessageContent>
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
      </PromptMessageContent>
    </PromptMessageContainer>
    Examples:
    <div>{defaultQueries.map(q => <QueryBlock key={q.id} canDelete={false} />)}</div>
  </Fragment>
);
export default DefaultSavedQueries;
