import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { EntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { INDEXES } from 'graphql/constants';
import { IParticipantDiagnosis, IParticipantEntity } from 'graphql/participants/models';

import { generateLocalTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { userColsHaveSameKeyAsDefaultCols } from 'utils/tables';

import { SectionId } from '../utils/anchorLinks';
import getDiagnosisDefaultColumns from '../utils/getDiagnosisColumns';

interface OwnProps {
  participant?: IParticipantEntity;
  loading: boolean;
}

const cbExcludeMondoTermKey = (c: { key: string }) => c.key !== 'mondo_term';

const DiagnosisTable = ({ participant, loading }: OwnProps) => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();
  const diagnoses: IParticipantDiagnosis[] =
    participant?.diagnosis?.hits?.edges?.map((e) => ({ key: e.node.diagnosis_id, ...e.node })) ||
    [];

  const diagnosisDefaultColumns = getDiagnosisDefaultColumns();

  const userColumnPreferences = userInfo?.config?.participants?.tables?.diagnosis?.columns || [];

  const userColumnPreferencesOrDefault = userColsHaveSameKeyAsDefaultCols(
    userColumnPreferences,
    diagnosisDefaultColumns,
  )
    ? [...userColumnPreferences]
    : diagnosisDefaultColumns.map((c, index) => ({
        visible: true,
        index,
        key: c.key,
      }));

  return (
    <EntityTable
      id={SectionId.DIAGNOSIS}
      loading={loading}
      data={diagnoses}
      total={diagnoses.length}
      title={intl.get('entities.participant.diagnosis')}
      header={intl.get('entities.participant.diagnosis')}
      columns={diagnosisDefaultColumns}
      initialColumnState={userColumnPreferencesOrDefault}
      headerConfig={{
        enableTableExport: true,
        enableColumnSort: true,
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              participants: {
                tables: {
                  diagnosis: {
                    columns: newState,
                  },
                },
              },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            generateLocalTsvReport({
              fileName: 'diagnoses',
              index: INDEXES.PARTICIPANT,
              headers: diagnosisDefaultColumns.filter(cbExcludeMondoTermKey),
              cols: userColumnPreferencesOrDefault.filter(cbExcludeMondoTermKey).map((x) => ({
                visible: x.visible,
                key: x.key,
              })),
              rows: diagnoses,
            }),
          ),
      }}
    />
  );
};

export default DiagnosisTable;
