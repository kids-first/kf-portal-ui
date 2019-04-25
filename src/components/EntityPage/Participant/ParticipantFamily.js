import * as React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import { EntityContentSection, EntityContentDivider } from '../';

const enhance = compose(withTheme);

const ParticipantFamily = ({ theme, participant, ...props }) => {
  return (
    <React.Fragment>
      <EntityContentSection title="Family Pedigree and Shared Diagnoses/Phenotypes">
        Pedigree Chart Tool
      </EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="File Counts for Family Members">
        Family Member Files Table
      </EntityContentSection>
    </React.Fragment>
  );
};

export default enhance(ParticipantFamily);
