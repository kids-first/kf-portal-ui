import React from 'react';
import { CohortCard } from './ui';

const PhenotypeBreakdown = ({ sqon }) => (
  <CohortCard long title="Phenotypes">
    <pre>{JSON.stringify(sqon, null, 2)}</pre>
  </CohortCard>
);

export default PhenotypeBreakdown;
