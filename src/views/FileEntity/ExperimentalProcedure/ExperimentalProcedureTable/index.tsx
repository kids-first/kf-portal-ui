import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { IFileEntity, ISequencingExperiment } from 'graphql/files/models';
import { SectionId } from 'views/FileEntity/utils/anchorLinks';
import getExperimentalProcedureColumns from 'views/FileEntity/utils/getExperimentalProcedureColumns';

import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';

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

  return (
    <EntityTable
      id={SectionId.EXPERIMENTAL_PROCEDURE}
      loading={loading}
      data={sequencingExperiments}
      title={intl.get('entities.file.experimental_procedure.title')}
      header={intl.get('entities.file.experimental_procedure.title')}
      columns={getExperimentalProcedureColumns()}
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
      }}
    />
  );
};

export default ExperimentalProcedureTable;
