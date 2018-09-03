import React, { Fragment } from 'react';

import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import { Link } from 'uikit/Core';

const DefaultSavedQueries = () => (
  <Fragment>
    <PromptMessageContainer info my={20}>
      <PromptMessageHeading info mb={10}>
        You have no saved queries yet.
      </PromptMessageHeading>
      <PromptMessageContent>
        Explore the{' '}
        <Link hasExternalIcon={false} to="/search/file">
          File Repository
        </Link>{' '}
        and start saving queries!
      </PromptMessageContent>
    </PromptMessageContainer>
    Popular queries
  </Fragment>
);
export default DefaultSavedQueries;
