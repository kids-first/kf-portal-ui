import startCase from 'lodash/startCase';
import { format } from 'date-fns';
import saveTSV from '@kfarranger/components/dist/DataTable/TableToolbar/saveTSV';
import urlJoin from 'url-join';
import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';

const downloadUrl = urlJoin(arrangerApiRoot, `${arrangerProjectId}/download`);

const findColumnsByField_File = [
  'kf_id',
  'external_id',
  'family.father_id',
  'family.mother_id',
  'family.family_id',
  'family.external_id',
  'is_proband',
  'study.name',
  'study.external_id',
  'gender',
  'race',
  'ethnicity',
  'phenotype.hpo_phenotype_observed',
  'phenotype.hpo_phenotype_not_observed',
  'diagnoses.diagnosis',
  'diagnoses.external_id',
  'diagnoses.age_at_event_days',
  'diagnoses.diagnosis_category',
  'diagnoses.icd_id_diagnosis',
  'diagnoses.mondo_id_diagnosis',
  'diagnoses.ncit_id_diagnosis',
  'diagnoses.source_text_diagnosis',
  'diagnoses.source_text_tumor_location',
  'diagnoses.spatial_scriptor',
  'diagnoses.uberon_id_tumor_location',
];

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
  const columnConfigs = fields.map(field =>
    typeof field === 'string' ? columns.find(column => column.field === field) : field,
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
              'latest_did',
              'file_name',
              'data_type',
              'file_format',
              'sequencing_experiments.experiment_strategy',
              'participants.kf_id',
              'participants.is_proband',
              'participants.family_id',
              'participants.biospecimens.external_sample_id',
              'participants.biospecimens.external_aliquot_id',
            ],
            columns,
          ),
          sort: [
            { field: 'participants.family_id', order: 'asc' },
            { field: 'kf_id', order: 'asc' },
          ],
        },
      ],
    });
  };
}
export const fileManifestParticipantsOnly = getManifestDownload('participant');

export const fileManifestParticipantsAndFamily = getManifestDownload('participant-family');

const getClinicalDownload = type => ({ sqon, columns, isFileRepo }) => () =>
  saveTSV({
    url: downloadUrl,
    files: [
      {
        fileName: format(new Date(), `[${type}_clinical_]YYYYMMDD[.tsv]`),
        sqon: isFileRepo ? hackCrossIndex(sqon) : sqon,
        index: 'participant',
        sort: [
          { field: 'family_id', order: 'asc' },
          { field: 'kf_id', order: 'asc' },
          { field: 'diagnoses.age_at_event_days', order: 'desc' },
        ],
        columns: findColumnsByField(findColumnsByField_File, columns),
      },
    ],
  });

export const clinicalDataParticipants = getClinicalDownload('participant');

export const clinicalDataFamily = getClinicalDownload('participant-and-family');

export const downloadBiospecimen = ({ sqon, columns, isFileRepo }) => () =>
  saveTSV({
    url: downloadUrl,
    files: [
      {
        fileName: format(new Date(), '[participants_biospecimen_]YYYYMMDD[.tsv]'),
        sqon: isFileRepo ? hackCrossIndex(sqon) : sqon,
        index: 'participant',
        uniqueBy: 'biospecimens.hits.edges[].node.kf_id',
        columns: findColumnsByField(
          [
            'biospecimens.kf_id',
            'biospecimens.external_sample_id',
            'biospecimens.external_aliquot_id',
            'biospecimens.age_at_event_days',
            'biospecimens.anatomical_site',
            'biospecimens.composition',
            'biospecimens.tissue_type',
            'biospecimens.tumor_descriptor',
            'biospecimens.analyte_type',
            'biospecimens.concentration_mg_per_ml',
            'biospecimens.shipment_date',
            'biospecimens.shipment_origin',
            'biospecimens.volume_ml',
            'biospecimens.uberon_id',
          ],
          columns,
        ),
      },
    ],
  });
