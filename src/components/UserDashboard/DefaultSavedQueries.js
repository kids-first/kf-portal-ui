import React, { Fragment } from 'react';

import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import { Link } from 'uikit/Core';
import QueryBlock from './QueryBlock';

const defaultQueries = [];

const DefaultSavedQueries = () => (
  <Fragment>
    <PromptMessageContainer info my={20}>
      <PromptMessageHeading info mb={10}>
        You have no saved queries yet.
      </PromptMessageHeading>
      <PromptMessageContent>
        Explore the <Link to="/search/file">File Repository</Link> and start saving queries!
      </PromptMessageContent>
    </PromptMessageContainer>
    Examples:
    <div>{defaultQueries.map(q => <QueryBlock key={q.id} canDelete={false} />)}</div>
  </Fragment>
);
export default DefaultSavedQueries;
