import { format } from 'date-fns';
import saveTSV from '@arranger/components/dist/DataTable/TableToolbar/saveTSV';

// TODO: update fields for kids first mapping when available.

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
        columns: findColumnsByField(['file_id'], columns),
      },
      {
        fileName: format(new Date(), '[kidsfirst-manifest_metadata_]YYYY-MM-DD[.tsv]'),
        sqon,
        index: 'file',
        columns: findColumnsByField(
          [
            'file_id',
            'file_name',
            'data_type',
            'data_format',
            'experimental_strategy',
            'cases.case_id',
            {
              Header: 'Sample ID',
              field: 'cases.samples.sample_id',
              listAccessor: 'cases.hits.edges',
              query:
                'cases { hits(first: 99) { total, edges { node { samples { hits(first: 99) { edges { node { sample_id } } } } } } } }',
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

export const clinicalDataFamily = ({ sqon, columns }) => null; // TODO: implement

export const downloadBiospecimen = ({ sqon, columns }) => null; // TODO: implement
