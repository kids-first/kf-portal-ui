import React from 'react';
import _ from 'lodash';
import { pickData } from './utils';
import { formatToGB } from './utils';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { Link } from 'react-router-dom';

export const toFilePropertiesSummary = data => {
  const participants = data.participants.hits.edges[0].node;
  const study = participants.study;
  const biospecimens = participants.biospecimens.hits.edges[0].node;

  // it could have been easier (see below), but `data.experiment_strategies` is sometimes empty,
  //  even if data.sequencing_experiments.hits.edges is ont empty for the given file 😕
  // const experimentalStrategies =
  //   _.uniq(_.get(data, 'experiment_strategies').filter(datum => !!datum)).join(', ') || '--';

  const experimentalStrategies =
    _.uniq(
      data.sequencing_experiments.hits.edges
        .filter(edge => edge.node && edge.node.experiment_strategy)
        .map(edge => edge.node.experiment_strategy),
    ).join(', ') || '--';

  return [
    { title: 'Kids First ID:', summary: pickData(data, 'kf_id') },

    { title: 'Name:', summary: pickData(data, 'file_name') },
    {
      title: 'Study:',
      summary: (
        <Link
          to={''}
          onClick={e => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
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
      summary: experimentalStrategies,
    },
    { title: 'Data Type:', summary: pickData(data, 'data_type') },
    { title: 'File Format:', summary: pickData(data, 'file_format') },
    { title: 'Size:', summary: pickData(data, 'size', size => formatToGB(size)) },
  ];
};
