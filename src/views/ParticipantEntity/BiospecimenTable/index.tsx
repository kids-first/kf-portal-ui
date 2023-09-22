import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTable, EntityTableRedirectLink } from '@ferlab/ui/core/pages/EntityPage';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import { generateLocalTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { STATIC_ROUTES } from 'utils/routes';
import { userColsHaveSameKeyAsDefaultCols } from 'utils/tables';

import { SectionId } from '../utils/anchorLinks';
import {
  getBiospecimensDefaultColumns,
  getBiospecimensFromParticipant,
} from '../utils/biospecimens';

interface OwnProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

const BiospecimenTable = ({ participant, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const { biospecimens, total } = getBiospecimensFromParticipant(participant);

  const biospecimensDefaultColumns = getBiospecimensDefaultColumns();

  const userColumnPreferences = userInfo?.config?.participants?.tables?.biospecimens?.columns || [];
  const userColumnPreferencesOrDefault = userColsHaveSameKeyAsDefaultCols(
    userColumnPreferences,
    biospecimensDefaultColumns,
  )
    ? [...userColumnPreferences]
    : biospecimensDefaultColumns.map((c, index) => ({
        visible: true,
        index,
        key: c.key,
      }));

  return (
    <EntityTable
      id={SectionId.BIOSPECIMEN}
      loading={loading}
      data={biospecimens}
      title={intl.get('entities.biospecimen.biospecimen')}
      titleExtra={[
        <EntityTableRedirectLink
          key="1"
          to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
          icon={<ExternalLinkIcon width={14} />}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: participant ? [participant.participant_id] : [],
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
      total={total}
      header={intl.get('entities.biospecimen.biospecimen')}
      columns={biospecimensDefaultColumns}
      initialColumnState={userColumnPreferencesOrDefault}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participants: {
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
            generateLocalTsvReport({
              index: INDEXES.PARTICIPANT,
              fileName: 'biospecimens',
              headers: biospecimensDefaultColumns,
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
