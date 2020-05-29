import startCase from 'lodash/startCase';
import { format } from 'date-fns';
import saveTSV from '@kfarranger/components/dist/DataTable/TableToolbar/saveTSV';
import urlJoin from 'url-join';
import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';

const downloadUrl = urlJoin(arrangerApiRoot, `${arrangerProjectId}/download`);

function findColumnsByField(fields, columns) {
  const columnConfigs = fields.map((field) =>
    typeof field === 'string' ? columns.find((column) => column.field === field) : field,
  );

  const missingColumns = columnConfigs.map((c, i) => (c ? false : fields[i])).filter(Boolean);

  if (missingColumns.length !== 0) {
    console.warn(
      'columns missing from download: ',
      missingColumns.map((c) => c.field || c).join(', '),
    );
  }

  return columnConfigs
    .filter(Boolean)
    .map((c) => ({ ...c, show: true, Header: c.Header || startCase(c.field.replace(/\./g, ' ')) }));
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

export const fileManifestParticipantsAndFamily = getManifestDownload('participant-family');
