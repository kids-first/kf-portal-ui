import React from 'react';

import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
  NoteList,
} from '../styles';
import Info from '../Info';
import { CardLink } from '../styles';

const NoProjects = ({ tabToCreate }) => (
  <Column>
    <PromptMessageContainer mb={0} width={'100%'}>
      <PromptMessageHeading mb={10}>
        You are connected to Cavatica, but you don’t have any projects yet.
      </PromptMessageHeading>
      <PromptMessageContent>
        <NoteList>
          <li>
            <CardLink onClick={tabToCreate}>Create a Cavatica Project</CardLink> easily from the
            portal.
          </li>
          <li>
            Or join one of the{' '}
            <ExternalLink
              href={'https://cavatica.sbgenomics.com/public/controlled-projects#q'}
              hasExternalIcon={false}
            >
              Cavatica public controlled projects
            </ExternalLink>
          </li>
        </NoteList>
      </PromptMessageContent>
    </PromptMessageContainer>
    <Info
      link={{
        url: 'https://kidsfirstdrc.org/support/analyze-data/',
        text: 'Cavatica compute cloud platform',
      }}
    />
  </Column>
);

export default NoProjects;
