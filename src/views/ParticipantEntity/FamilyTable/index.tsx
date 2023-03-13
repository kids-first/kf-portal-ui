import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { Button } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { STATIC_ROUTES } from 'utils/routes';

import { getFamilyDefaultColumns } from '../utils/family';
import { SectionId } from '..';

export const MIN_FAMILY_NUMBER = 1;
const COLUMNS_PREFIX = 'family.family_relations.';

export enum Relation {
  mother = 'mother',
  father = 'father',
  proband = 'proband',
  other = 'other',
  self = 'self',
}

interface OwnProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

const FamilyTable = ({ participant, loading }: OwnProps) => {
  const history = useHistory();
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const participantId = participant?.participant_id || '';
  const familyMembers = [
    { id: participantId, relation: Relation.self, related_participant_id: participantId },
    ...hydrateResults(participant?.family?.family_relations?.hits?.edges || []),
  ];

  if (!participant?.families_id || familyMembers.length <= MIN_FAMILY_NUMBER) {
    return <></>;
  }

  const initialColumnState = (userInfo?.config.participant?.tables?.family?.columns || []).map(
    (column) => ({
      ...column,
      key: column.key.replace(COLUMNS_PREFIX, ''),
    }),
  );

  return (
    <EntityTable
      id={SectionId.FAMILY}
      loading={loading}
      data={familyMembers}
      title={intl.get('screen.participantEntity.family.title')}
      header={
        <>
          {intl.get('screen.participantEntity.family.title')}
          <Button
            type="link"
            onClick={() => {
              history.push(STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS);
              addQuery({
                queryBuilderId: DATA_EXPLORATION_QB_ID,
                query: generateQuery({
                  newFilters: [
                    generateValueFilter({
                      field: 'families_id',
                      value: participant?.families_id ? [participant?.families_id] : [],
                      index: INDEXES.PARTICIPANT,
                    }),
                  ],
                }),
              });
            }}
          >
            ({participant?.families_id})
          </Button>
        </>
      }
      columns={getFamilyDefaultColumns()}
      initialColumnState={initialColumnState}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participant: {
                tables: {
                  family: {
                    columns: newState.map((column) => ({
                      ...column,
                      key: `${COLUMNS_PREFIX}${column.key}`,
                    })),
                  },
                },
              },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            fetchTsvReport({
              columnStates: userInfo?.config.participant?.tables?.family?.columns,
              columns: getFamilyDefaultColumns(),
              index: INDEXES.PARTICIPANT,
              sqon: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    index: INDEXES.PARTICIPANT,
                    value: participant?.participant_id ? [participant?.participant_id] : [],
                  }),
                ],
              }),
            }),
          ),
      }}
    />
  );
};

export default FamilyTable;
