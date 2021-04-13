import React from 'react';

type OwnProps = {
  clinvarId: string;
  label?: string;
};

const ClinVarExternalLink = ({ clinvarId, label }: OwnProps) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinvarId}`}
  >
    {label || clinvarId}
  </a>
);

export default ClinVarExternalLink;
