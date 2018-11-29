import * as React from 'react';
import styled from 'react-emotion';

import { kfWebRoot } from 'common/injectGlobals';
import ExternalLink from 'uikit/ExternalLink';
import { PromptMessageContainer, PromptMessageHeading, PromptMessageContent } from './styles';

const Container = styled('div')`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default () => {
  return (
    <Container>
      <PromptMessageContainer error mb={'8px'}>
        <PromptMessageHeading error mb={10}>
          Oops, something went wrong.
        </PromptMessageHeading>
        <PromptMessageContent>
          Try refreshing the page and if the error persists,{' '}
          <ExternalLink href={`${kfWebRoot}/contact/`} hasExternalIcon={false}>
            contact us
          </ExternalLink>
        </PromptMessageContent>
      </PromptMessageContainer>
    </Container>
  );
};
