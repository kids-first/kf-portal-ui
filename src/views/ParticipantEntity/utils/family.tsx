import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantDiagnosis } from 'graphql/participants/models';

export const getFamilyDefaultColumns = (): ProColumnType[] => [
  {
    key: 'participant_id',
    title: intl.get('screen.participantEntity.family.id'),
    dataIndex: 'participant_id',
  },
  {
    key: 'family_type',
    title: intl.get('screen.participantEntity.family.relationship'),
    dataIndex: 'family_type',
  },
  {
    key: 'diagnosis',
    title: intl.get('screen.participantEntity.family.affectedStatus'),
    dataIndex: 'diagnosis',
    render: (diagnosis: IArrangerResultsTree<IParticipantDiagnosis>) =>
      diagnosis?.hits?.edges?.some((dn) => dn.node.affected_status)
        ? 'Affected'
        : TABLE_EMPTY_PLACE_HOLDER,
  },
];
