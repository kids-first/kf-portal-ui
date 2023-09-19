import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import EntityPage, { EntityDescriptions } from '@ferlab/ui/core/pages/EntityPage';
import { useParticipantEntity } from 'graphql/participants/actions';
import { IFamilyRelationToProband } from 'graphql/participants/models';

import { getLinks, SectionId } from './utils/anchorLinks';
import getProfileItems from './utils/getProfileItems';
import { getSummaryItems } from './utils/summary';
import BiospecimenTable from './BiospecimenTable';
import DiagnosisTable from './DiagnosisTable';
import FamilyTable from './FamilyTable';
import FileTable from './FileTable';
import PhenotypeTable from './PhenotypeTable';
import SummaryHeader from './SummaryHeader';
import ParticipantEntityTitle from './Title';

const ParticipantEntity = () => {
  const { participant_id } = useParams<{ participant_id: string }>();

  const { participants, loading } = useParticipantEntity({
    field: 'participant_id',
    value: participant_id,
  });
  const participant = participants ? participants[0] : undefined;

  const familyMembers: IFamilyRelationToProband[] =
    participant?.family?.relations_to_proband?.hits?.edges?.map((x) => ({ ...x.node })) || [];
  const showFamilyTable = !loading && familyMembers.length > 0;

  return (
    <EntityPage
      links={getLinks(showFamilyTable)}
      pageId={'participant-entity-page'}
      data={participant}
      loading={loading}
      emptyText={intl.get('no.data.available')}
    >
      <ParticipantEntityTitle participant={participant} loading={loading} />

      <EntityDescriptions
        id={SectionId.SUMMARY}
        loading={loading}
        descriptions={getSummaryItems(participant)}
        header={intl.get('entities.global.summary')}
        subheader={<SummaryHeader participant={participant} />}
      />

      <EntityDescriptions
        id={SectionId.PROFILE}
        loading={loading}
        descriptions={getProfileItems(participant)}
        title={intl.get('entities.participant.profile')}
        header={intl.get('entities.participant.profile')}
      />

      {showFamilyTable && <FamilyTable familyMembers={familyMembers} participant={participant!} />}

      <DiagnosisTable participant={participant} loading={loading} />

      <PhenotypeTable participant={participant} loading={loading} />

      <BiospecimenTable participant={participant} loading={loading} />

      <FileTable participant={participant} loading={loading} />
    </EntityPage>
  );
};

export default ParticipantEntity;
