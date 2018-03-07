import { startCase } from 'lodash';
import { format } from 'date-fns';
import saveTSV from '@arranger/components/dist/DataTable/TableToolbar/saveTSV';

function findColumnsByField(fields, columns) {
  const columnConfigs = fields.map(
    field => (typeof field === 'string' ? columns.find(column => column.field === field) : field),
  );

  const missingColumns = columnConfigs.map((c, i) => (c ? false : fields[i])).filter(Boolean);

  if (missingColumns.length !== 0) {
    console.warn(
      'columns missing from download: ',
      missingColumns.map(c => c.field || c).join(', '),
    );
  }

  return columnConfigs
    .filter(Boolean)
    .map(c => ({ ...c, show: true, Header: c.Header || startCase(c.field.replace(/\./g, ' ')) }));
}

export const fileManifestParticipantsOnly = ({ sqon, columns }) => () => {
  return saveTSV({
    fileName: format(new Date(), '[kidsfirst-manifest-participant_]YYYY-MM-DD'),
    files: [
      {
        fileName: format(new Date(), '[kidsfirst-manifest_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(['kf_id'], columns),
      },
      {
        fileName: format(new Date(), '[kidsfirst-manifest_metadata_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(
          [
            'kf_id',
            'file_name',
            'data_type',
            'file_format',
            'sequencing_experiments.experiment_strategy',
            'participants.kf_id',
            {
              Header: 'sample.kf_id',
              field: 'participants.samples.kf_id',
              jsonPath: '$.participants.hits.edges..node.samples.hits.edges..node.kf_id',
              query:
                'participants { hits { total, edges { node { samples { hits { edges { node { kf_id } } } } } } } }',
              type: 'list',
            },
          ],
          columns,
        ),
      },
    ],
  });
};

export const fileManifestParticipantsAndFamily = ({ sqon, columns }) => null; // TODO: implement

export const clinicalDataParticipants = ({ sqon, columns }) => null; // TODO: implement

export const clinicalDataFamily = ({ sqon, columns }) => () => {
  return saveTSV({
    files: [
      {
        fileName: format(new Date(), '[participants_clinical_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'participant',
        uniqueBy: 'family.family_members.hits.edges[].node.kf_id',
        columns: findColumnsByField(
          [
            'diagnoses.diagnosis',
            'family.family_members.kf_id',
            'family.family_id',
            'family.family_members.relationship',
            'kf_id',
            'family.family_members.gender',
            'family.family_members.ethnicity',
            'family.family_members.race',
            'family.family_members.phenotype.hpo.hpo_ids',
            'family.family_members.phenotype.hpo.negative_hpo_ids',
            {
              field: 'family.family_members.diagnoses.age_at_event_days',
              listAccessor: 'family.family_members.hits.edges',
              query:
                'family { family_members { hits { edges { node { diagnoses { hits { edges { node { age_at_event_days } } } } } } } } }',
              type: 'list',
            },
            {
              field: 'family.family_members.diagnoses.diagnosis',
              listAccessor: 'family.family_members.hits.edges',
              query:
                'family { family_members { hits { edges { node { diagnoses { hits { edges { node { diagnosis } } } } } } } } }',
              type: 'list',
            },
            {
              field: 'family.family_members.diagnoses.diagnosis_category',
              listAccessor: 'family.family_members.hits.edges',
              query:
                'family { family_members { hits { edges { node { diagnoses { hits { edges { node { diagnosis_category } } } } } } } } }',
              type: 'list',
            },
            {
              field: 'family.family_members.diagnoses.tumor_location',
              listAccessor: 'family.family_members.hits.edges',
              query:
                'family { family_members { hits { edges { node { diagnoses { hits { edges { node { tumor_location } } } } } } } } }',
              type: 'list',
            },
          ],
          columns,
        ),
      },
    ],
  });
};

export const downloadBiospecimen = ({ sqon, columns }) => null; // TODO: implement
