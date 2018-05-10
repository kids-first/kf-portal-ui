import { startCase } from 'lodash';
import { format } from 'date-fns';
import saveTSV from '@arranger/components/dist/DataTable/TableToolbar/saveTSV';
import urlJoin from 'url-join';
import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';

const downloadUrl = urlJoin(arrangerApiRoot, `${arrangerProjectId}/download`);

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
    const filename = `[kidsfirst-${type}-manifest_]YYYY-MM-DD`;
    return saveTSV({
      url: downloadUrl,
      fileName: format(new Date(), filename),
      files: [
        {
          fileName: format(new Date(), `${filename}[.tsv]`),
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
              'participants.is_proband',
              'participants.family.family_id',
              'participants.samples.kf_id',
              'participants.samples.tissue_type',
              'participants.samples.aliquots.kf_id',
            ],
            columns,
          ),
          sort: [
            { field: 'participants.family.family_id', order: 'asc' },
            { field: 'kf_id', order: 'asc' },
          ],
        },
      ],
    });
  };
}
export const fileManifestParticipantsOnly = getManifestDownload('participant');

export const fileManifestParticipantsAndFamily = getManifestDownload('participant-family');

const getClinicalDownload = type => ({ sqon, columns }) => () =>
  saveTSV({
    url: downloadUrl,
    files: [
      {
        fileName: format(new Date(), `[${type}_clinical_]YYYYMMDD[.tsv]`),
        sqon: hackCrossIndex(sqon),
        index: 'participant',
        sort: [
          { field: 'family.family_id', order: 'asc' },
          { field: 'kf_id', order: 'asc' },
          { field: 'diagnoses.age_at_event_days', order: 'desc' },
        ],
        columns: findColumnsByField(
          [
            'kf_id',
            'family.father_id',
            'family.mother_id',
            'is_proband',
            {
              Header: 'Other Relationships',
              field: 'family.family_compositions.family_members.kf_id',
              type: 'list',
              jsonPath:
                '$.family.family_compositions.family_members.hits.edges[?(@.node.relationship!="mother" && @.node.relationship!="father")].node.kf_id',
              query: `
                family {
                  family_compositions {
                    hits {
                      edges {
                        node {
                          family_members {
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
                      }
                    }
                  }
                }
              `,
            },
            'study.name',
            'gender',
            'race',
            'ethnicity',
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

export const clinicalDataParticipants = getClinicalDownload('participant');

export const clinicalDataFamily = getClinicalDownload('participant-and-family');

export const downloadBiospecimen = ({ sqon, columns }) => () => {
  return saveTSV({
    url: downloadUrl,
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
