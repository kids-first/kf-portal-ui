import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import ColorTag, { ColorTagType } from '@ferlab/ui/core/components/ColorTag';
import { Tag } from 'antd';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantDiagnosis, IParticipantEntity } from 'graphql/participants/models';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { DYNAMIC_ROUTES } from 'utils/routes';

import styles from 'components/uiKit/UnderlineLink/index.module.scss';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { mapStudyToPedcBioportal } from 'views/Studies/utils/helper';

export const getSummaryItems = (participant?: IParticipantEntity): IEntityDescriptionsItem[] => {
  const diagnosis = hydrateResults(participant?.diagnosis?.hits?.edges || []);
  const pedcBioportal = mapStudyToPedcBioportal(participant?.study?.study_code || '');

  return [
    {
      label: intl.get('screen.participantEntity.summary.id'),
      value: participant?.participant_id || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.externalId'),
      value: participant?.external_id || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.study'),
      value: participant?.study.study_name ? (
        <Link className={styles.underlineLink} to={`${DYNAMIC_ROUTES.STUDY_ENTITY}/${participant?.study.study_code}`}>
          {participant?.study.study_name} ({participant?.study.study_code})
        </Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    },
    {
      label: intl.get('screen.participantEntity.summary.pedcBioPortal'),
      value: pedcBioportal ? <ExternalLink href={`https://pedcbioportal.kidsfirstdrc.org/patient?studyId=${pedcBioportal}&caseId=${participant?.participant_id}`}>
        {participant?.participant_id}
      </ExternalLink> : TABLE_EMPTY_PLACE_HOLDER

    },
    {
      label: intl.get('screen.participantEntity.summary.diagnosisCategory'),
      value: diagnosis.length
        ? diagnosis.map(({ source_text }: IParticipantDiagnosis, index: number) => <Tag key={`${source_text}-${index}`}>{source_text}</Tag>)
        : TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.familyComposition'),
      value: <ColorTag type={ColorTagType.Family} value={participant?.family_type} />
    },
    {
      label: intl.get('screen.participantEntity.summary.proband'),
      value: <ColorTag type={ColorTagType.Boolean} value={participant?.is_proband ? intl.get('screen.participantEntity.summary.proband') : 'false'} />
    },
  ];
};
