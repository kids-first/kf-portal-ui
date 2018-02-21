import { format } from 'date-fns';
import saveTSV from '@arranger/components/dist/DataTable/TableToolbar/saveTSV';

export function findColumnsByField(fields, columns) {
  return fields
    .map(
      field => (typeof field === 'string' ? columns.find(column => column.field === field) : field),
    )
    .filter(Boolean)
    .map(c => ({ ...c, show: true }));
}

export const downloadBiospecimen = ({ sqon, columns }) => () => {
  return saveTSV({
    files: [
      {
        fileName: format(new Date(), '[cases_biospecimen_]YYYYMMDD[.tar.gz]'),
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
