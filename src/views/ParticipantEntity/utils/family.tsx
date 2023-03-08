import intl from 'react-intl-universal';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantDiagnosis } from 'graphql/participants/models';
import ColorTag, { ColorTagType } from '@ferlab/ui/core/components/ColorTag';

export const getFamilyDefaultColumns = (): ProColumnType[] => [
  {
    key: 'related_participant_id',
    title: intl.get('screen.participantEntity.family.id'),
    dataIndex: 'related_participant_id',
  },
  {
    key: 'relation',
    title: intl.get('screen.participantEntity.family.relationship'),
    dataIndex: 'relation',
    render: (relation: string) => <ColorTag type={ColorTagType.Position} value={relation} />
  },
  // TODO: need te be added when mapping in participant.family is done
  {
    key: 'affected_status',
    title: intl.get('screen.participantEntity.family.affectedStatus'),
    dataIndex: 'affected_status',
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
];
