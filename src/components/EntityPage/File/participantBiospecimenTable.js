import _ from 'lodash';
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

export const toParticpantBiospecimenData = data =>
  _.flattenDeep(
    data.participants.hits.edges.map(nodes => {
      const p = nodes.node;

      return p.biospecimens.hits.edges.map(bio => {
        const biospecimen = bio.node;
        return {
          participant_id: pickData(p, 'kf_id'),
          external_id: pickData(p, 'external_id'),
          study_name: pickData(p, 'study.short_name'),
          proband: pickData(p, 'is_proband', val => (Boolean(val) ? 'Yes' : 'No')),
          biospecimen_id: pickData(biospecimen, 'kf_id'),
          analyte_type: pickData(biospecimen, 'analyte_type'),
          tissue_type: pickData(biospecimen, 'source_text_tissue_type'),
          age_at_sample_acquisition: pickData(biospecimen, 'age_at_event_days'),
        };
      });
    }),
  );
