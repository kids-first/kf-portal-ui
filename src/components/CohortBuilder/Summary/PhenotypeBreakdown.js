import React from 'react';
import { PaddedColumn, CohortCard, spacing } from './ui';

const PhenotypeBreakdown = ({ sqon }) => (
  <PaddedColumn xl={spacing.xl}>
    <CohortCard long title="Phenotypes">
      <pre>{JSON.stringify(sqon, null, 2)}</pre>
    </CohortCard>
  </PaddedColumn>
);

export default PhenotypeBreakdown;
