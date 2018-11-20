import React from 'react';

import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';

const NoProjects = () => (
  <Column>
    <PromptMessageContainer mb={0} width={'100%'}>
      <PromptMessageHeading mb={10}>
        You are connected to CAVATICA, but you don’t have any projects yet.
      </PromptMessageHeading>
      <PromptMessageContent>
        <ul>
          <li>
            <ExternalLink
              href={'https://kidsfirstdrc.org/support/studies-and-access/'}
              hasExternalIcon={false}
            >
              Create a CAVATICA Project
            </ExternalLink>{' '}
            easily from the portal.
          </li>
          <li>
            Or join one of the
            <ExternalLink
              href={'https://cavatica.sbgenomics.com/public/controlled-projects#q'}
              hasExternalIcon={false}
            >
              {' '}
              CAVATICA public controlled projects
            </ExternalLink>
          </li>
        </ul>
      </PromptMessageContent>
    </PromptMessageContainer>
  </Column>
);

export default NoProjects;
