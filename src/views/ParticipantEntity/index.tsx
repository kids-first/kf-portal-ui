import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';
import EntityPageWrapper, {
  EntityDescriptions,
  EntityTableMultiple,
  EntityTitle,
} from '@ferlab/ui/core/pages/EntityPage';
import { Button, Dropdown, Menu, Tag } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IFileEntity } from 'graphql/files/models';
import { useParticipantEntity } from 'graphql/participants/actions';
import { generateSelectionSqon } from 'views/DataExploration/utils/selectionSqon';

import { ReportType } from 'services/api/reports/models';
import { fetchReport } from 'store/report/thunks';

import {
  getDataTypeColumns,
  getExperimentalStrategyColumns,
  getFilesByExperimentalStrategy,
  getFilesDataTypeInfo,
} from './utils/files';
import { getProfilItems } from './utils/profil';
import { getSummaryItems } from './utils/summary';
import BiospecimensTable from './BiospecimensTable';
import DiagnosisTable from './DiagnosisTable';
import FamilyTable, { MIN_FAMILY_NUMBER } from './FamilyTable';
import PhenotypesTable from './PhenotypeTable';
import SummaryHeader from './SummaryHeader';

import styles from './index.module.scss';

export enum SectionId {
  SUMMARY = 'summary',
  PROFIL = 'profil',
  FAMILY = 'family',
  DIAGNOSIS = 'diagnosis',
  PHENOTYPE = 'phenotype',
  BIOSPECIMEN = 'biospecimen',
  DATAFILE = 'datafile',
}

const ParticipantEntity = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useParticipantEntity({
    field: 'participant_id',
    values: [id],
  });

  const files: IFileEntity[] = data?.files?.hits.edges.map(({ node }) => node) || [];
  const dataTypeInfoData = getFilesDataTypeInfo(files, data?.participant_id);
  const experimentalStrategyData = getFilesByExperimentalStrategy(files, data?.participant_id);
  const totalFamilyMembers = data?.family?.family_relations?.hits?.total || 0;

  const links: IAnchorLink[] = [
    { href: `#${SectionId.SUMMARY}`, title: intl.get('screen.participantEntity.summary.title') },
    { href: `#${SectionId.PROFIL}`, title: intl.get('screen.participantEntity.profile.title') },
    {
      href: `#${SectionId.FAMILY}`,
      title: intl.get('screen.participantEntity.family.title'),
      hidden: !data?.families_id || totalFamilyMembers <= MIN_FAMILY_NUMBER,
    },
    {
      href: `#${SectionId.DIAGNOSIS}`,
      title: intl.get('screen.participantEntity.diagnosis.title'),
    },
    {
      href: `#${SectionId.PHENOTYPE}`,
      title: intl.get('screen.participantEntity.phenotype.title'),
    },
    {
      href: `#${SectionId.BIOSPECIMEN}`,
      title: intl.get('screen.participantEntity.biospecimen.title'),
    },
    { href: `#${SectionId.DATAFILE}`, title: intl.get('screen.participantEntity.files.title') },
  ];

  const downloadClinicalMenu = (
    <Menu
      onClick={(e) =>
        dispatch(
          fetchReport({
            data: {
              sqon: generateSelectionSqon(INDEXES.PARTICIPANT, [id]),
              name: e.key,
            },
          }),
        )
      }
      items={[
        {
          key: ReportType.CLINICAL_DATA,
          label: 'Selected participants',
        },
        {
          key: ReportType.CLINICAL_DATA_FAM,
          label: 'Selected participants & families',
        },
      ]}
    />
  );

  return (
    <EntityPageWrapper
      pageId="participant-entity-page"
      links={links}
      data={data}
      loading={loading}
      emptyText={intl.get('no.data.available')}
    >
      <>
        <EntityTitle
          text={id}
          icon={<UserOutlined />}
          loading={loading}
          tag={
            data?.is_proband ? (
              <Tag>{intl.get('screen.participantEntity.proband')}</Tag>
            ) : (
              <Tag>{intl.get('screen.participantEntity.familyMember')}</Tag>
            )
          }
          extra={
            <Dropdown
              className={styles.dropdown}
              overlay={downloadClinicalMenu}
              placement="bottomLeft"
              key={'download-clinical-data-dropdown'}
            >
              <Button icon={<DownloadOutlined />}>
                {intl.get('screen.participantEntity.downloadData')}
              </Button>
            </Dropdown>
          }
        />
        <EntityDescriptions
          id={SectionId.SUMMARY}
          subheader={<SummaryHeader data={data} />}
          loading={loading}
          header={intl.get('screen.participantEntity.summary.title')}
          descriptions={getSummaryItems(data)}
        />

        <EntityDescriptions
          id={SectionId.PROFIL}
          loading={loading}
          title={intl.get('screen.participantEntity.profile.title')}
          header={intl.get('screen.participantEntity.profile.title')}
          descriptions={getProfilItems(data)}
        />

        <FamilyTable participant={data} loading={loading} />
        <DiagnosisTable participant={data} loading={loading} />
        <PhenotypesTable participant={data} loading={loading} />
        <BiospecimensTable id={id} />

        <EntityTableMultiple
          id={SectionId.DATAFILE}
          loading={loading}
          title={intl.get('screen.participantEntity.files.dataFile')}
          header={intl.get('screen.participantEntity.files.dataFile')}
          tables={[
            {
              columns: getDataTypeColumns(files.length),
              data: dataTypeInfoData,
              subTitle: intl.get('screen.participantEntity.files.numberByDataTypes'),
            },
            {
              columns: getExperimentalStrategyColumns(files.length),
              data: experimentalStrategyData,
              subTitle: intl.get('screen.participantEntity.files.numberByExperimentalStrategy'),
            },
          ]}
        />
      </>
    </EntityPageWrapper>
  );
};

export default ParticipantEntity;
