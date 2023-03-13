import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import ColorTag, { ColorTagType } from '@ferlab/ui/core/components/ColorTag';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IParticipantFamilyRelations } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { STATIC_ROUTES } from 'utils/routes';

import { Relation } from '../FamilyTable';

export const getFamilyDefaultColumns = (): ProColumnType[] => [
  {
    key: 'related_participant_id',
    title: intl.get('screen.participantEntity.family.id'),
    render: (participant: IParticipantFamilyRelations) =>
      participant.relation == Relation.self ? (
        participant.related_participant_id
      ) : (
        <Link to={`${STATIC_ROUTES.PARTICIPANT_ENTITY}/${participant.related_participant_id}`}>
          {participant.related_participant_id}
        </Link>
      ),
  },
  {
    key: 'relation',
    title: intl.get('screen.participantEntity.family.relationship'),
    dataIndex: 'relation',
    render: (relation: string) => <ColorTag type={ColorTagType.Position} value={relation} />,
  },
  // TODO: need te be added when mapping in participant.family is done
  {
    key: 'affected_status',
    title: intl.get('screen.participantEntity.family.affectedStatus'),
    dataIndex: 'affected_status',
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
];
