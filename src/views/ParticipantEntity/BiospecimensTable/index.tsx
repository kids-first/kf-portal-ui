import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { useBiospecimenParticipant } from 'graphql/biospecimens/actions';
import { INDEXES } from 'graphql/constants';

import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';

import { getBiospecimensDefaultColumns } from '../utils/biospecimens';
import { SectionId } from '..';

interface OwnProps {
  id: string;
}

const BiospecimensTable = ({ id }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const { data, loading } = useBiospecimenParticipant({
    field: 'participant.participant_id',
    values: [id],
  });

  return (
    <EntityTable
      id={SectionId.BIOSPECIMEN}
      loading={loading}
      data={data}
      title={intl.get('screen.participantEntity.biospecimen.title')}
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
