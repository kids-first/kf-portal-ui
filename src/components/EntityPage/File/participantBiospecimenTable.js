import React from 'react';
import _ from 'lodash';
import ExternalLink from 'uikit/ExternalLink';
import { pickData } from './utils';

export const particpantBiospecimenColumns = [
  { Header: 'Participant ID', accessor: 'participant_id' },
  { Header: 'External ID', accessor: 'external_id' },
  { Header: 'Study Name', accessor: 'study_name' },
  { Header: 'Proband', accessor: 'proband' },
  { Header: 'Biospecimen ID', accessor: 'biospecimen_id' },
  { Header: 'Analyte Type', accessor: 'analyte_type' },
  { Header: 'Tissue Type', accessor: 'tissue_type' },
  { Header: 'Age at Sample Acquisition', accessor: 'age_at_sample_acquisition' },
];

export const particpantBiospecimenData = data =>
  _.flattenDeep(
    data.participants.hits.edges.map(nodes => {
      const p = nodes.node;

      return p.biospecimens.hits.edges.map(bio => {
        const biospecimen = bio.node;
        return {
          participant_id: (
            <ExternalLink hasExternalIcon={false} href="">
              {pickData(p, 'kf_id')}
            </ExternalLink>
          ),
          external_id: pickData(p, 'external_id'),
          study_name: <ExternalLink href="">{pickData(p, 'study.short_name')}</ExternalLink>,
          proband: pickData(p, 'is_proband', val => (typeof val === 'boolean' ? 'Yes' : 'No')),
          biospecimen_id: pickData(biospecimen, 'kf_id'),
          analyte_type: pickData(biospecimen, 'analyte_type'),
          tissue_type: pickData(biospecimen, 'source_text_tissue_type'),
          age_at_sample_acquisition: '--',
        };
      });
    }),
  );
