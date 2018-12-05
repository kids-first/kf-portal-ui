import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import styled from 'react-emotion';
import Row from '../../../uikit/Row';
import Column from '../../../uikit/Column';

import { withApi } from 'services/api';
import {
  EntityTitleBar,
  EntityTitle,
  EntityActionBar,
  EntityContent,
  EntityContentSection,
  EntityContentDivider,
} from '../';

const enhance = compose(
  injectState,
  withTheme,
  withApi,
);

const Container = styled(Column)`
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const FileEntity = ({ state, effects, theme, fileId, ...props }) => {
  return (
    <Container>
      <EntityTitleBar>
        <EntityTitle icon="file" title={fileId} tags={['WGS', 'Aligned Reads']} />
      </EntityTitleBar>
      <EntityActionBar>Share Button</EntityActionBar>
      <EntityContent>
        <EntityContentSection title="File Properties">
          <Row style={{ width: '100%' }}>
            <Column style={{ flex: 1, paddingRight: 15, border: 1 }}>Summary Table 1</Column>
            <Column style={{ flex: 1, paddingLeft: 15, border: 1 }}>Summary Table 2</Column>
          </Row>
        </EntityContentSection>
        <EntityContentDivider />
        <EntityContentSection title="Associated Participants/Biospecimens">
          Participant and Biospeciment Table Here
        </EntityContentSection>
        <EntityContentDivider />
        <EntityContentSection title="Associated Experimental Strategies">
          Experimental Strategy Table Here
        </EntityContentSection>
        <EntityContentDivider />
        <EntityContentSection title="Sequencing Read Properties">
          Read Property Numbers Here
        </EntityContentSection>
      </EntityContent>
    </Container>
  );
};

export default enhance(FileEntity);
