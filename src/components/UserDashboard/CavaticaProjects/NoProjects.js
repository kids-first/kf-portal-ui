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
import { compose } from 'recompose';
import { CardLink } from '../styles';

const NoProjects = () => (
  <Column>
    <PromptMessageContainer mb={0} width={'100%'}>
      <PromptMessageHeading mb={10}>
        You are connected to CAVATICA, but you don’t have any projects yet.
      </PromptMessageHeading>
      <PromptMessageContent>
<<<<<<< HEAD
        <NoteList>
          <NotePoints>
            <CardLink onClick={() => card.setIndex(1)}>Create a CAVATICA Project</CardLink>
=======
        <ul>
          <li>
            <CardLink>Create a CAVATICA Project</CardLink>
>>>>>>> remove context and hoc card
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
