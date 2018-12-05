import * as React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import Row from '../../../uikit/Row';
import Column from '../../../uikit/Column';

import { EntityContentSection, EntityContentDivider } from '../';

const enhance = compose(withTheme);

const ParticipantSummary = () => {
  return (
    <React.Fragment>
      <EntityContentSection title="Summary">
        <Row style={{ width: '100%' }}>
          <Column style={{ flex: 1, paddingRight: 15 }}>Summary Table 1</Column>
          <Column style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>Summary Table 2</Column>
          <Column style={{ flex: 1, paddingLeft: 15 }}>Summary Table 3</Column>
        </Row>
      </EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="Biospecimens">Biospeciment Table Here</EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="File Counts">
        <Row style={{ width: '100%' }}>
          <Column style={{ flex: 1, paddingRight: 15 }}>Files Table 1</Column>
          <Column style={{ flex: 1, paddingLeft: 15 }}>Files Table 2</Column>
        </Row>
      </EntityContentSection>
    </React.Fragment>
  );
};

export default enhance(ParticipantSummary);
