import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import ExternalLinkIcon from '@ferlab/ui/core/components/ExternalLink/ExternalLinkIcon';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTable, EntityTableRedirectLink } from '@ferlab/ui/core/pages/EntityPage';
import { INDEXES } from 'graphql/constants';
import { IFileEntity } from 'graphql/files/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { SectionId } from 'views/FileEntity/utils/anchorLinks';
import {
  getBiospecimenColumns,
  getBiospecimensFromFile,
} from 'views/FileEntity/utils/biospecimens';

import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { STATIC_ROUTES } from 'utils/routes';

interface OwnProps {
  file?: IFileEntity;
  loading: boolean;
}

const BiospecimenTable = ({ file, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const biospecimens = getBiospecimensFromFile(file);

  return (
    <EntityTable
      id={SectionId.PARTICIPANT_SAMPLE}
      loading={loading}
      data={biospecimens}
      total={biospecimens.length}
      title={intl.get('entities.file.participant_sample.title')}
      titleExtra={[
        <EntityTableRedirectLink
          key="1"
          to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'file_id',
                    value: file ? [file.file_id] : [],
                    index: INDEXES.FILES,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
          icon={<ExternalLinkIcon width="14px" />}
        >
          {intl.get('global.viewInDataExploration')}
        </EntityTableRedirectLink>,
      ]}
      header={intl.get('entities.file.participant_sample.title')}
      columns={getBiospecimenColumns()}
      initialColumnState={userInfo?.config.files?.tables?.biospecimens?.columns}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({ files: { tables: { biospecimens: { columns: newState } } } }),
          ),
      }}
    />
  );
};

export default BiospecimenTable;
