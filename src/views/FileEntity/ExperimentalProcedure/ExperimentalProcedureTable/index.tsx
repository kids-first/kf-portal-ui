import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { INDEXES } from 'graphql/constants';
import { IFileEntity, ISequencingExperiment } from 'graphql/files/models';
import { SectionId } from 'views/FileEntity/utils/anchorLinks';
import getExperimentalProcedureColumns from 'views/FileEntity/utils/getExperimentalProcedureColumns';

import { generateLocalTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { userColsHaveSameKeyAsDefaultCols } from 'utils/tables';

interface OwnProps {
  file?: IFileEntity;
  loading: boolean;
}

const ExperimentalProcedureTable = ({ file, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const sequencingExperiments: ISequencingExperiment[] =
    file?.sequencing_experiment?.hits?.edges?.map((e) => ({
      key: e.node.sequencing_experiment_id,
      ...e.node,
    })) || [];

  const experimentalProcedureDefaultColumns = getExperimentalProcedureColumns();
  const userColumnPreferences =
    userInfo?.config?.files?.tables?.experimental_procedures?.columns || [];
  const userColumnPreferencesOrDefault = userColsHaveSameKeyAsDefaultCols(
    userColumnPreferences,
    experimentalProcedureDefaultColumns,
  )
    ? [...userColumnPreferences]
    : experimentalProcedureDefaultColumns.map((c, index) => ({
        visible: true,
        index,
        key: c.key,
      }));

  return (
    <EntityTable
      id={SectionId.EXPERIMENTAL_PROCEDURE}
      loading={loading}
      data={sequencingExperiments}
      title={intl.get('entities.file.experimental_procedure.title')}
      header={intl.get('entities.file.experimental_procedure.title')}
      columns={experimentalProcedureDefaultColumns}
      initialColumnState={userInfo?.config.files?.tables?.experimental_procedures?.columns}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newColumns) =>
          dispatch(
            updateUserConfig({
              files: { tables: { experimental_procedures: { columns: newColumns } } },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            generateLocalTsvReport({
              fileName: 'experimentalProcedure',
              index: INDEXES.FILE,
              headers: experimentalProcedureDefaultColumns,
              cols: userColumnPreferencesOrDefault.map((x) => ({
                visible: x.visible,
                key: x.key,
              })),
              rows: sequencingExperiments,
            }),
          ),
      }}
    />
  );
};

export default ExperimentalProcedureTable;
