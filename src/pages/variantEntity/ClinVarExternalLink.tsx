import React from 'react';

type OwnProps = {
  clinvarId: string;
};

const ClinVarExternalLink = ({ clinvarId }: OwnProps) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinvarId}`}
  >
    {clinvarId}
  </a>
);

export default ClinVarExternalLink;
