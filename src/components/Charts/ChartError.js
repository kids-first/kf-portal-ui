import React from 'react';

import { kfWebRoot } from 'common/injectGlobals';
import ExternalLink from 'uikit/ExternalLink';
import { PromptMessageContainer, PromptMessageHeading, PromptMessageContent } from './styles';

import { chartErrorContainer } from './Charts.module.css';

export default () => {
  return (
    <div className={chartErrorContainer}>
      <PromptMessageContainer error style={{ marginBottom: '8px' }}>
        <PromptMessageHeading style={{ marginBottom: '10px' }}>
          Oops, something went wrong.
        </PromptMessageHeading>
        <PromptMessageContent>
          Try refreshing the page and if the error persists,{' '}
          <ExternalLink href={`${kfWebRoot}/contact/`} hasExternalIcon={false}>
            contact us
          </ExternalLink>
        </PromptMessageContent>
      </PromptMessageContainer>
    </div>
  );
};
