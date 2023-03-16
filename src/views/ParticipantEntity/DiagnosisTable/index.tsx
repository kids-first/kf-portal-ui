import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IParticipantEntity } from 'graphql/participants/models';
import intl from 'react-intl-universal';
import { SectionId } from '..';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { getDiagnosisDefaultColumns } from '../utils/diagnosis';
import { useUser } from 'store/user';
import { useDispatch } from 'react-redux';
import { updateUserConfig } from 'store/user/thunks';
import { fetchTsvReport } from 'store/report/thunks';
import { INDEXES } from 'graphql/constants';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';

const COLUMNS_PREFIX = 'diagnosis.';

interface OwnProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

const DiagnosisTable = ({ participant, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();
  const diagnosis = hydrateResults(participant?.diagnosis?.hits?.edges || []);

  const initialColumnState = (userInfo?.config.participant?.tables?.diagnosis?.columns || []).map(column => ({
    ...column,
    key: column.key.replace(COLUMNS_PREFIX, '')
  }))

  return (
    <EntityTable
      id={SectionId.DIAGNOSIS}
      loading={loading}
      data={diagnosis}
      title={intl.get('screen.participantEntity.diagnosis.title')}
      header={intl.get('screen.participantEntity.diagnosis.title')}
      columns={getDiagnosisDefaultColumns()}
      initialColumnState={initialColumnState}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participant: {
                tables: {
                  diagnosis: {
                    columns: newState.map(column => ({ ...column, key: `${COLUMNS_PREFIX}${column.key}` }))
                  }
                }
              }
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            fetchTsvReport({
              columnStates: userInfo?.config.participant?.tables?.diagnosis?.columns,
              columns: getDiagnosisDefaultColumns(),
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
  )

}

export default DiagnosisTable;