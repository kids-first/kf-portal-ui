import { startCase } from 'lodash';
import { format } from 'date-fns';
import saveTSV from '@arranger/components/dist/DataTable/TableToolbar/saveTSV';

function hackCrossIndex(value, key) {
  if (!key && process.env.NODE_ENV !== 'production') {
    console.warn('This code should removed when cross index searching is implemented');
  }
  if (typeof value === 'object' && value) {
    return Object.entries(value).reduce((acc, [key, value]) => {
      acc[key] = hackCrossIndex(value, key);
      return acc;
    }, value.constructor());
  } else if (key === 'field') {
    if (value.indexOf('participants') === 0) {
      return value.replace(/participants\./, '');
    } else {
      return `files.${value}`;
    }
  } else {
    return value;
  }
}

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
function getManifestDownload(type) {
  return ({ sqon, columns }) => () => {
    return saveTSV({
      fileName: format(new Date(), `[kidsfirst-${type}-manifest_]YYYY-MM-DD`),
      files: [
        {
          fileName: format(new Date(), `[kidsfirst-${type}-manifest_]YYYY-MM-DD[.tsv]`),
          sqon,
          index: 'file',
          columns: findColumnsByField(['kf_id', 'uuid'], columns),
        },
        {
          fileName: format(new Date(), `[kidsfirst-${type}-metadata_]YYYY-MM-DD[.tsv]`),
          sqon,
          index: 'file',
          columns: findColumnsByField(
            [
              'kf_id',
              'uuid',
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
}
export const fileManifestParticipantsOnly = getManifestDownload('participant');

export const fileManifestParticipantsAndFamily = getManifestDownload('participant-family');

export const clinicalDataParticipants = ({ sqon, columns }) => () => {
  return saveTSV({
    files: [
      {
        fileName: format(new Date(), '[participants_clinical_]YYYY-MM-DD[.tsv]'),
        sqon: hackCrossIndex(sqon),
        index: 'participant',
        uniqueBy: 'diagnoses.hits.edges[].node.diagnosis',
        columns: findColumnsByField(
          [
            'kf_id',
            'study.name',
            {
              Header: 'Father ID',
              field: 'family.family_members.kf_id',
              jsonPath:
                '$.family.family_members.hits.edges[?(@.node.relationship=="father")].node.kf_id',
              query: `
                family {
                  family_members{
                    hits {
                      edges {
                        node {
                          relationship
                          kf_id
                        }
                      }
                    }
                  }
                }
              `,
            },
            {
              Header: 'Mother ID',
              field: 'family.family_members.kf_id',
              jsonPath:
                '$.family.family_members.hits.edges[?(@.node.relationship=="mother")].node.kf_id',
              query: `
                family {
                  family_members{
                    hits {
                      edges {
                        node {
                          relationship
                          kf_id
                        }
                      }
                    }
                  }
                }
              `,
            },
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

export const clinicalDataFamily = ({ sqon, columns }) => () => {
  return saveTSV({
    files: [
      {
        fileName: format(new Date(), '[participants_clinical_]YYYY-MM-DD[.tsv]'),
        sqon: hackCrossIndex(sqon),
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
              jsonPath:
                '$.family.family_members.hits.edges..node.diagnoses.hits.edges..node.age_at_event_days',
              query:
                'family { family_members { hits { edges { node { diagnoses { hits { edges { node { age_at_event_days } } } } } } } } }',
              type: 'list',
            },
            {
              field: 'family.family_members.diagnoses.diagnosis',
              jsonPath:
                '$.family.family_members.hits.edges..node.diagnoses.hits.edges..node.diagnosis',
              query:
                'family { family_members { hits { edges { node { diagnoses { hits { edges { node { diagnosis } } } } } } } } }',
              type: 'list',
            },
            {
              field: 'family.family_members.diagnoses.diagnosis_category',
              jsonPath:
                '$.family.family_members.hits.edges..node.diagnoses.hits.edges..node.diagnosis_category',
              query:
                'family { family_members { hits { edges { node { diagnoses { hits { edges { node { diagnosis_category } } } } } } } } }',
              type: 'list',
            },
            {
              field: 'family.family_members.diagnoses.tumor_location',
              jsonPath:
                '$.family.family_members.hits.edges..node.diagnoses.hits.edges..node.tumor_location',
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

export const downloadBiospecimen = ({ sqon, columns }) => () => {
  return saveTSV({
    fileName: format(new Date(), '[participants_biospecimen_]YYYYMMDD[.tar.gz]'),
    files: [
      {
        fileName: 'sample.tsv',
        sqon: hackCrossIndex(sqon),
        index: 'participant',
        uniqueBy: 'samples.hits.edges[].node.kf_id',
        columns: findColumnsByField(
          [
            'samples.kf_id',
            'kf_id',
            'samples.age_at_event_days',
            'samples.anatomical_site',
            'samples.composition',
            'samples.external_id',
            'samples.tissue_type',
            'samples.tumor_descriptor',
            'samples.uuid',
          ],
          columns,
        ),
      },
      {
        fileName: 'aliquot.tsv',
        sqon: hackCrossIndex(sqon),
        index: 'participant',
        uniqueBy: 'samples.hits.edges[].node.aliquots.kf_id',
        columns: findColumnsByField(
          [
            'samples.aliquots.kf_id',
            'kf_id',
            'samples.kf_id',
            'samples.aliquots.analyte_type',
            'samples.aliquots.concentration',
            'samples.aliquots.shipment_date',
            'samples.aliquots.shipment_destination',
            'samples.aliquots.shipment_origin',
            'samples.aliquots.uuid',
            'samples.aliquots.volume',
          ],
          columns,
        ),
      },
    ],
  });
};
