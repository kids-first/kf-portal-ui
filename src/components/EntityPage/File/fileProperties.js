import React from 'react';
import { get } from 'lodash';

import { formatToGB } from './utils';

import ExternalLink from 'uikit/ExternalLink';

export const toFilePropertiesSummary = data => {
  const participants = data.participants.hits.edges[0].node;
  const study = participants.study;
  const biospecimens = participants.biospecimens.hits.edges[0].node;

  return [
    { title: 'Kids First ID:', summary: data.kf_id },

    { title: 'Name:', summary: data.file_name },
    {
      title: 'Study:',
      summary: <ExternalLink href={null}>{`${study.short_name} (${study.kf_id})`}</ExternalLink>,
    },
    { title: 'Access:', summary: data.controlled_access ? 'Controlled' : '' },
    { title: 'Consent Codes:', summary: biospecimens.dbgap_consent_code },
    {
      title: 'External ID:',
      summary: data.external_id,
    },
    {
      title: 'Harmonized Data:',
      summary: data.is_harmonized ? 'Yes' : 'No',
    },
    { title: 'Reference Genome:', summary: data.reference_genome },
    {
      title: 'Experimental Strategy:',
      summary: get(data, data.experiment_strategies, []).map(strategies => <div>{strategies}</div>),
    },
    { title: 'Data Type:', summary: data.data_type },
    { title: 'File Format:', summary: data.file_format },
    { title: 'Size:', summary: formatToGB(data.size) },
  ];
};
