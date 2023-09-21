import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity, IParticipantPhenotype } from 'graphql/participants/models';

import { generateLocalTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { userColsHaveSameKeyAsDefaultCols } from 'utils/tables';

import { SectionId } from '../utils/anchorLinks';
import getPhenotypeDefaultColumns from '../utils/getPhenotypeColumns';

interface OwnProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

// 'hpo term', at this moment, is computed at the table cell level.
// To avoid refactoring, the field is simply excluded from the tsv.
const cbExcludeHpoTermKey = (c: { key: string }) => c.key !== 'hpo_term';

const PhenotypeTable = ({ participant, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();

  const phenotype: IParticipantPhenotype[] =
    participant?.phenotype?.hits?.edges?.map((e) => ({
      key: e.node.fhir_id,
      ...e.node,
      // TODO maybe fix this in back but no time and needed to have it in TSV export
      hpo_phenotype: e.node.hpo_phenotype_observed || e.node.hpo_phenotype_not_observed,
    })) || [];

  const phenotypesDefaultColumns = getPhenotypeDefaultColumns();

  const userColumnPreferences = userInfo?.config?.participants?.tables?.phenotype?.columns || [];
  const userColumnPreferencesOrDefault = userColsHaveSameKeyAsDefaultCols(
    userColumnPreferences,
    phenotypesDefaultColumns,
  )
    ? [...userColumnPreferences]
    : phenotypesDefaultColumns.map((c, index) => ({
        visible: true,
        index,
        key: c.key,
      }));

  return (
    <EntityTable
      id={SectionId.PHENOTYPE}
      loading={loading}
      data={phenotype}
      total={phenotype.length}
      title={intl.get('entities.participant.phenotype')}
      header={intl.get('entities.participant.phenotype')}
      columns={phenotypesDefaultColumns}
      initialColumnState={userColumnPreferencesOrDefault}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participants: {
                tables: {
                  phenotype: {
                    columns: newState,
                  },
                },
              },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            generateLocalTsvReport({
              fileName: 'phenotypes',
              index: INDEXES.PARTICIPANT,
              headers: phenotypesDefaultColumns.filter(cbExcludeHpoTermKey),
              cols: userColumnPreferencesOrDefault.filter(cbExcludeHpoTermKey).map((x) => ({
                visible: x.visible,
                key: x.key,
              })),
              rows: phenotype,
            }),
          ),
      }}
    />
  );
};

export default PhenotypeTable;
