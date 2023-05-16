import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';

import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';

import { getPhenotypeDefaultColumns } from '../utils/phenotype';
import { SectionId } from '..';

const COLUMNS_PREFIX = 'phenotype.';

interface OwnProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

const PhenotypesTable = ({ participant, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();
  const phenotypes = hydrateResults(participant?.phenotype?.hits?.edges || []);

  const initialColumnState = (userInfo?.config.participant?.tables?.phenotype?.columns || []).map(
    (column) => ({
      ...column,
      key: column.key.replace(COLUMNS_PREFIX, ''),
    }),
  );

  return (
    <EntityTable
      id={SectionId.PHENOTYPE}
      loading={loading}
      data={phenotypes}
      total={phenotypes.length}
      title={intl.get('screen.participantEntity.phenotype.title')}
      header={intl.get('screen.participantEntity.phenotype.title')}
      columns={getPhenotypeDefaultColumns()}
      initialColumnState={initialColumnState}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participant: {
                tables: {
                  phenotype: {
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
              columnStates: userInfo?.config.participant?.tables?.phenotype?.columns,
              columns: getPhenotypeDefaultColumns(),
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

export default PhenotypesTable;
