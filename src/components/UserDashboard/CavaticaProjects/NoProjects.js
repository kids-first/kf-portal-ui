import React from 'react';

import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
  NotePoints,
  NoteList,
} from '../styles';
import Info from '../Info';

const NoProjects = () => (
  <Column>
    <PromptMessageContainer mb={0} width={'100%'}>
      <PromptMessageHeading mb={10}>
        You are connected to CAVATICA, but you don’t have any projects yet.
      </PromptMessageHeading>
      <PromptMessageContent>
        <NoteList>
          <NotePoints>
            <ExternalLink
              href={'https://kidsfirstdrc.org/support/studies-and-access/'}
              hasExternalIcon={false}
            >
              Create a CAVATICA Project
            </ExternalLink>{' '}
            easily from the portal.
          </NotePoints>
          <NotePoints>
            Or join one of the{' '}
            <ExternalLink
              href={'https://cavatica.sbgenomics.com/public/controlled-projects#q'}
              hasExternalIcon={false}
            >
              CAVATICA public controlled projects
            </ExternalLink>
          </NotePoints>
        </NoteList>
      </PromptMessageContent>
    </PromptMessageContainer>
    <Info
      link={{
        url: 'https://kidsfirstdrc.org/support/analyze-data/',
        text: 'CAVATICA compute cloud platform',
      }}
    />
  </Column>
);

export default NoProjects;
