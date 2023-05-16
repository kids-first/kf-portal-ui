import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import ExternalLinkIcon from '@ferlab/ui/core/components/ExternalLink/ExternalLinkIcon';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTable, EntityTableRedirectLink } from '@ferlab/ui/core/pages/EntityPage';
import { useBiospecimenParticipant } from 'graphql/biospecimens/actions';
import { INDEXES } from 'graphql/constants';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { STATIC_ROUTES } from 'utils/routes';

import { getBiospecimensDefaultColumns } from '../utils/biospecimens';
import { SectionId } from '..';

interface OwnProps {
  id: string;
}

const BiospecimensTable = ({ id }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const { data, loading, total } = useBiospecimenParticipant({
    field: 'participant.participant_id',
    values: [id],
  });

  return (
    <EntityTable
      id={SectionId.BIOSPECIMEN}
      loading={loading}
      data={data}
      total={total}
      title={intl.get('screen.participantEntity.biospecimen.title')}
      titleExtra={[
        <EntityTableRedirectLink
          key="1"
          to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
          icon={<ExternalLinkIcon width="14px" />}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: [id],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {intl.get('global.viewInDataExploration')}
        </EntityTableRedirectLink>,
      ]}
      header={intl.get('screen.participantEntity.biospecimen.title')}
      columns={getBiospecimensDefaultColumns()}
      initialColumnState={userInfo?.config.participant?.tables?.biospecimens?.columns}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participant: {
                tables: {
                  biospecimens: {
                    columns: newState,
                  },
                },
              },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            fetchTsvReport({
              columnStates: userInfo?.config.participant?.tables?.biospecimens?.columns,
              columns: getBiospecimensDefaultColumns(),
              index: INDEXES.PARTICIPANT,
              sqon: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant.participant_id',
                    index: INDEXES.BIOSPECIMENS,
                    value: [id],
                  }),
                ],
              }),
            }),
          ),
      }}
    />
  );
};

export default BiospecimensTable;
