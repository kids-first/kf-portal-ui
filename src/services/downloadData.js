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

  return columnConfigs.filter(Boolean).map(c => ({ ...c, show: true }));
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

export const clinicalDataParticipants = ({ sqon, columns }) => () => {
  return saveTSV({
    files: [
      {
        fileName: format(new Date(), '[participants_clinical_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'participant',
        uniqueBy: 'diagnoses.hits.edges[].node.diagnosis',
        columns: findColumnsByField(
          [
            'kf_id',
            'study.name',
            // TODO: father_id
            // TODO: mother_id
            'race',
            'ethnicity',
            'gender',
            'phenotype.hpo.hpo_ids',
            'phenotype.hpo.negative_hpo_ids',
            'diagnoses.age_at_event_days',
            'diagnoses.diagnosis',
            'diagnoses.diagnosis_category',
            'diagnoses.tumor_location',
          ],
          columns,
        ),
      },
    ],
  });
};

export const clinicalDataFamily = ({ sqon, columns }) => null; // TODO: implement

export const downloadBiospecimen = ({ sqon, columns }) => null; // TODO: implement
