import * as React from 'react';
import { compose } from 'recompose';

import styled from 'react-emotion';
import Column from '../../../uikit/Column';

import { withApi } from 'services/api';
import { EntityTitleBar, EntityTitle, EntityActionBar, EntityContent } from '../';
import { SecondaryNavMenu, SecondaryNavContent } from '../../../uikit/SecondaryNav';
import ParticipantSummary from './ParticipantSummary';
import ParticipantClinical from './ParticipantClinical';
import ParticipantFamily from './ParticipantFamily';

const enhance = compose(withApi);

const Container = styled(Column)`
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const FileEntity = ({ api, participantId, location }) => {
  return (
    <Container>
      <EntityTitleBar>
        <EntityTitle
          icon="participant"
          title={participantId}
          tags={['Structural Birth Defect', 'Proband', 'Trio']}
        />
      </EntityTitleBar>
      <EntityActionBar>
        <SecondaryNavMenu
          tabs={[
            { name: 'Summary', hash: 'summary' },
            { name: 'Clinical', hash: 'clinical' },
            { name: 'Family', hash: 'family' },
          ]}
          defaultHash="summary"
          location={location}
        />
      </EntityActionBar>
      <EntityContent>
        <SecondaryNavContent target="summary" location={location}>
          <ParticipantSummary />
        </SecondaryNavContent>
        <SecondaryNavContent target="clinical" location={location}>
          <ParticipantClinical />
        </SecondaryNavContent>
        <SecondaryNavContent target="family" location={location}>
          <ParticipantFamily />
        </SecondaryNavContent>
      </EntityContent>
    </Container>
  );
};

export default enhance(FileEntity);
