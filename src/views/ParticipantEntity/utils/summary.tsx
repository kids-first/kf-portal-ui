import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import ColorTag, { ColorTagType } from '@ferlab/ui/core/components/ColorTag';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Space, Tag, Tooltip } from 'antd';
import { IParticipantDiagnosis, IParticipantEntity } from 'graphql/participants/models';
import { mapStudyToPedcBioportal } from 'views/Studies/utils/helper';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import underlineLinkStyles from 'components/uiKit/UnderlineLink/index.module.scss';
import { DYNAMIC_ROUTES } from 'utils/routes';

import styles from '../index.module.scss';

export const getSummaryItems = (participant?: IParticipantEntity): IEntityDescriptionsItem[] => {
  const diagnosis = hydrateResults(participant?.diagnosis?.hits?.edges || []);
  const pedcBioportal = mapStudyToPedcBioportal(participant?.study?.study_code || '');

  return [
    {
      label: intl.get('screen.participantEntity.summary.id'),
      value: participant?.participant_id || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: (
        <Space size={4}>
          {intl.get('screen.participantEntity.summary.externalId')}
          <Tooltip
            className={styles.info}
            title={intl.get('screen.participantEntity.summary.externalId')}
          >
            <InfoCircleOutlined size={14} />
          </Tooltip>
        </Space>
      ),
      value: participant?.external_id || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.study'),
      value: participant?.study.study_name ? (
        <Link
          className={underlineLinkStyles.underlineLink}
          to={`${DYNAMIC_ROUTES.STUDY_ENTITY}/${participant?.study.study_code}`}
        >
          {participant?.study.study_name} ({participant?.study.study_code})
        </Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    },
    {
      label: intl.get('screen.participantEntity.summary.dbGaP'),
      value: participant?.study_external_id ? (
        <ExternalLink
          href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${participant?.study_external_id}`}
        >
          {participant?.study_external_id}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    },
    {
      label: intl.get('screen.participantEntity.summary.pedcBioPortal'),
      value: pedcBioportal ? (
        <ExternalLink
          href={`https://pedcbioportal.kidsfirstdrc.org/patient?studyId=${pedcBioportal}&caseId=${participant?.participant_id}`}
        >
          {participant?.participant_id}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    },
    {
      label: intl.get('screen.participantEntity.summary.diagnosisCategory'),
      value: diagnosis.filter(({ diagnosis_category }) => !!diagnosis_category).length
        ? diagnosis.map(({ diagnosis_category }: IParticipantDiagnosis, index: number) => (
            <Tag key={`${diagnosis_category}-${index}`}>{diagnosis_category}</Tag>
          ))
        : TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.familyComposition'),
      value: <ColorTag type={ColorTagType.Family} value={participant?.family_type} />,
    },
    {
      label: intl.get('screen.participantEntity.summary.proband'),
      value: (
        <ColorTag
          type={ColorTagType.Boolean}
          value={
            participant?.is_proband ? intl.get('screen.participantEntity.summary.proband') : 'false'
          }
        />
      ),
    },
  ];
};
