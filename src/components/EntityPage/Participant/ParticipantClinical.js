import * as React from 'react';

import { EntityContentSection, EntityContentDivider } from '../';

const ParticipantClinical = () => {
  return (
    <React.Fragment>
      <EntityContentSection title="Diagnoses">Diagnoses Chart</EntityContentSection>
      <EntityContentDivider />
      <EntityContentSection title="Phenotypes">Phenotypes Chart</EntityContentSection>
    </React.Fragment>
  );
};

export default ParticipantClinical;
