import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import ExternalLinkIcon from '@ferlab/ui/core/components/ExternalLink/ExternalLinkIcon';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { Button } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IFileEntity } from 'graphql/files/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { SectionId } from 'views/FileEntity/utils/anchorLinks';
import {
  getBiospecimenColumns,
  getBiospecimensFromFile,
} from 'views/FileEntity/utils/biospecimens';

import { generateLocalTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { STATIC_ROUTES } from 'utils/routes';
import { userColsHaveSameKeyAsDefaultCols } from 'utils/tables';

import styles from './index.module.scss';

interface OwnProps {
  file?: IFileEntity;
  loading: boolean;
}

const BiospecimenTable = ({ file, loading }: OwnProps) => {
  const navigate = useNavigate();
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const biospecimens = getBiospecimensFromFile(file);
  const biospecimenDefaultColumns = getBiospecimenColumns();
  const userColumnPreferences = userInfo?.config?.files?.tables?.biospecimens?.columns || [];
  const userColumnPreferencesOrDefault = userColsHaveSameKeyAsDefaultCols(
    userColumnPreferences,
    biospecimenDefaultColumns,
  )
    ? [...userColumnPreferences]
    : biospecimenDefaultColumns.map((c, index) => ({
        visible: true,
        index,
        key: c.key,
      }));

  return (
    <EntityTable
      id={SectionId.PARTICIPANT_SAMPLE}
      loading={loading}
      data={biospecimens}
      total={biospecimens.length}
      title={intl.get('entities.file.participant_sample.title')}
      titleExtra={[
        <Button
          className={styles.viewInExplo}
          size="small"
          onClick={() => {
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'file_id',
                    value: file ? [file.file_id] : [],
                    index: INDEXES.FILE,
                  }),
                ],
              }),
              setAsActive: true,
            });
            navigate(STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS);
          }}
        >
          {intl.get('global.viewInExploration')}
          <ExternalLinkIcon />
        </Button>,
      ]}
      header={intl.get('entities.file.participant_sample.title')}
      columns={biospecimenDefaultColumns}
      initialColumnState={userInfo?.config.files?.tables?.biospecimens?.columns}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({ files: { tables: { biospecimens: { columns: newState } } } }),
          ),
        onTableExportClick: () =>
          dispatch(
            generateLocalTsvReport({
              fileName: 'participants-samples',
              index: INDEXES.FILE,
              headers: biospecimenDefaultColumns,
              cols: userColumnPreferencesOrDefault.map((x) => ({
                visible: x.visible,
                key: x.key,
              })),
              rows: biospecimens,
            }),
          ),
      }}
    />
  );
};

export default BiospecimenTable;
