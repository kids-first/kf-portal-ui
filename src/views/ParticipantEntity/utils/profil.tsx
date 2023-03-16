import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantEntity, IParticipantOutcomes } from 'graphql/participants/models';
import ColorTag, { ColorTagType } from '@ferlab/ui/core/components/ColorTag';
import intl from 'react-intl-universal';
import { capitalize } from 'lodash';

export const getProfilItems = (participant?: IParticipantEntity): IEntityDescriptionsItem[] => {
  const outcomes = hydrateResults(participant?.outcomes.hits.edges || []);

  return [
    {
      label: intl.get('screen.participantEntity.profile.race'),
      value: participant?.race || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.profile.ethnicity'),
      value: participant?.ethnicity || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      value: <ColorTag type={ColorTagType.Gender} value={capitalize(participant?.sex)} /> || TABLE_EMPTY_PLACE_HOLDER,
      label: intl.get('screen.participantEntity.profile.sex'),
    },
    {
      label: intl.get('screen.participantEntity.profile.vitalStatus'),
      value: outcomes.length
        ? outcomes.map(({ vital_status }: IParticipantOutcomes, index: number) => <ColorTag key={`${vital_status}-${index}`} value={vital_status} type={ColorTagType.VitalStatus} />)
        : TABLE_EMPTY_PLACE_HOLDER,
    },
  ];
};
