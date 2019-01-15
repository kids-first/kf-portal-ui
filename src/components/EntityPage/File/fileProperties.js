import React from 'react';
import { pickData } from './utils';
import { formatToGB } from './utils';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { Link } from 'react-router-dom';

export const toFilePropertiesSummary = data => {
  const participants = data.participants.hits.edges[0].node;
  const study = participants.study;
  const biospecimens = participants.biospecimens.hits.edges[0].node;

  return [
    { title: 'Kids First ID:', summary: pickData(data, 'kf_id') },

    { title: 'Name:', summary: pickData(data, 'file_name') },
    {
      title: 'Study:',
      summary: (
        <Link
          to={
            `/search/file?sqon=` +
            encodeURIComponent(
              `{"op":"and","content":[{"op":"in","content":{"field":"participants.study.short_name","value":["${
                study.short_name
              }"]}}]}`,
            )
          }
          onClick={e => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: TRACKING_EVENTS.actions.click + ` File Property: Study`,
              label: `${study.short_name} (${study.kf_id})`,
            });
          }}
        >{`${study.short_name} (${study.kf_id})`}</Link>
      ),
    },
    { title: 'Access:', summary: data.controlled_access ? 'Controlled' : 'Open' },
    { title: 'Consent Codes:', summary: pickData(biospecimens, 'dbgap_consent_code') },
    {
      title: 'External ID:',
      summary: pickData(data, 'external_id'),
    },
    {
      title: 'Harmonized Data:',
      summary: data.is_harmonized ? 'Yes' : 'No',
    },
    { title: 'Reference Genome:', summary: pickData(data, 'reference_genome') },
    {
      title: 'Experimental Strategy:',
      summary: pickData(data, data.experiment_strategies, d =>
        d.map((strategies, i) => <div key={i}>{strategies}</div>),
      ),
    },
    { title: 'Data Type:', summary: pickData(data, 'data_type') },
    { title: 'File Format:', summary: pickData(data, 'file_format') },
    { title: 'Size:', summary: pickData(data, 'size', size => formatToGB(size)) },
  ];
};
