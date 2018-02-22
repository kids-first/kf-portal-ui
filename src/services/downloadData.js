import { format } from 'date-fns';
import saveTSV from '@arranger/components/dist/DataTable/TableToolbar/saveTSV';

function findColumnsByField(fields, columns) {
  return fields
    .map(
      field => (typeof field === 'string' ? columns.find(column => column.field === field) : field),
    )
    .filter(Boolean)
    .map(c => ({ ...c, show: true }));
}

export const fileManifestParticipantsOnly = ({ sqon, columns }) => () => {
  // update data
  return saveTSV({
    fileName: format(new Date(), '[kidsfirst-manifest-participant_]YYYY-MM-DD'),
    files: [
      {
        fileName: format(new Date(), '[kidsfirst-manifest_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(['file_id'], columns),
      },
      {
        fileName: format(new Date(), '[kidsfirst-manifest_metadata_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(['file_id'], columns),
      },
    ],
  });
};

export const fileManifestParticipantsAndFamily = ({ sqon, columns }) => () => {
  // update data
  return saveTSV({
    fileName: format(new Date(), '[kidsfirst-manifest-participant-and-family_]YYYY-MM-DD'),
    files: [
      {
        fileName: format(new Date(), '[kidsfirst-manifest_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(['file_id'], columns),
      },
      {
        fileName: format(new Date(), '[kidsfirst-manifest_metadata_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(['file_id'], columns),
      },
    ],
  });
};

export const clinicalDataParticipants = ({ sqon, columns }) => () => {
  // update data
  return saveTSV({
    files: [
      {
        fileName: format(new Date(), '[cases_clinical_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(
          [
            'file_id',
            'file_name',
            // 'cases.dataset.id',
            'data_category',
            'data_type',
            {
              Header: 'Case ID',
              field: 'cases.case_id',
              listAccessor: 'cases.hits.edges',
              query: 'cases { hits(first: 99) { edges { node { case_id } } } }',
              type: 'list',
            },
            {
              Header: 'Sample ID',
              field: 'cases.samples.sample_id',
              listAccessor: 'cases.hits.edges',
              query:
                'cases { hits(first: 99) { total, edges { node { samples { hits(first: 99) { edges { node { sample_id } } } } } } } }',
              type: 'list',
            },
            {
              Header: 'Sample Type',
              field: 'cases.samples.sample_type',
              listAccessor: 'cases.hits.edges',
              query:
                'cases { hits(first: 99) { total, edges { node { samples { hits(first: 99) { edges { node { sample_type } } } } } } } }',
              type: 'list',
            },
          ],
          columns,
        ),
      },
    ],
  });
};

export const clinicalDataFamily = ({ sqon, columns }) => () => {
  // update data
  return saveTSV({
    files: [
      {
        fileName: format(new Date(), '[family_clinical_]YYYYMMDD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(
          [
            'file_id',
            'file_name',
            // 'cases.dataset.id',
            'data_category',
            'data_type',
            {
              Header: 'Case ID',
              field: 'cases.case_id',
              listAccessor: 'cases.hits.edges',
              query: 'cases { hits(first: 99) { edges { node { case_id } } } }',
              type: 'list',
            },
            {
              Header: 'Sample ID',
              field: 'cases.samples.sample_id',
              listAccessor: 'cases.hits.edges',
              query:
                'cases { hits(first: 99) { total, edges { node { samples { hits(first: 99) { edges { node { sample_id } } } } } } } }',
              type: 'list',
            },
            {
              Header: 'Sample Type',
              field: 'cases.samples.sample_type',
              listAccessor: 'cases.hits.edges',
              query:
                'cases { hits(first: 99) { total, edges { node { samples { hits(first: 99) { edges { node { sample_type } } } } } } } }',
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
        sqon,
        index: 'participant',
        uniqueBy: 'samples.hits.edges[].node.kf_id',
        columns: findColumnsByField(
          [
            'kf_id',
            'samples.kf_id',
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
        sqon,
        index: 'participant',
        uniqueBy: 'samples.hits.edges[].node.aliquots.kf_id',
        columns: findColumnsByField(
          [
            {
              Header: 'samples.aliquots.kf_id',
              field: 'samples.aliquots.kf_id',
              listAccessor: 'samples.hits.edges',
              query: 'samples { hits(first: 99) { edges { node { aliquots { kf_id } } } } }',
              type: 'list',
            },
            'kf_id',
            {
              Header: 'samples.kf_id',
              field: 'samples.kf_id',
              listAccessor: 'samples.hits.edges',
              query: 'samples { hits(first: 99) { edges { node { aliquots { kf_id } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.kf_id',
              field: 'samples.aliquots.kf_id',
              listAccessor: 'samples.hits.edges',
              query: 'samples { hits(first: 99) { edges { node { aliquots { kf_id } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.analyte_type',
              field: 'samples.aliquots.analyte_type',
              listAccessor: 'samples.hits.edges',
              query: 'samples { hits(first: 99) { edges { node { aliquots { analyte_type } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.concentration',
              field: 'samples.aliquots.concentration',
              listAccessor: 'samples.hits.edges',
              query:
                'samples { hits(first: 99) { edges { node { aliquots { concentration } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.shipment_date',
              field: 'samples.aliquots.shipment_date',
              listAccessor: 'samples.hits.edges',
              query:
                'samples { hits(first: 99) { edges { node { aliquots { shipment_date } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.shipment_destination',
              field: 'samples.aliquots.shipment_destination',
              listAccessor: 'samples.hits.edges',
              query:
                'samples { hits(first: 99) { edges { node { aliquots { shipment_destination } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.shipment_origin',
              field: 'samples.aliquots.shipment_origin',
              listAccessor: 'samples.hits.edges',
              query:
                'samples { hits(first: 99) { edges { node { aliquots { shipment_origin } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.uuid',
              field: 'samples.aliquots.uuid',
              listAccessor: 'samples.hits.edges',
              query: 'samples { hits(first: 99) { edges { node { aliquots { uuid } } } } }',
              type: 'list',
            },
            {
              Header: 'samples.aliquots.volume',
              field: 'samples.aliquots.volume',
              listAccessor: 'samples.hits.edges',
              query: 'samples { hits(first: 99) { edges { node { aliquots { volume } } } } }',
              type: 'list',
            },
          ],
          columns,
        ),
      },
    ],
  });
};
