import intl from 'react-intl-universal';
import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { useParticipantEntity, useParticipantsFamily } from 'graphql/participants/actions';
import { useHistory, useParams } from 'react-router-dom';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';
import EntityPageWrapper, {
  EntityDescriptions,
  EntityTitle,
} from '@ferlab/ui/core/pages/EntityPage';
import EntityTable from '@ferlab/ui/core/pages/EntityPage/EntityTable';
import { Button, Tag } from 'antd';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { INDEXES } from 'graphql/constants';
import { STATIC_ROUTES } from 'utils/routes';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { getDiagnosisDefaultColumns } from './utils/diagnosis';
import { getFamilyDefaultColumns } from './utils/family';
import { getPhenotypeDefaultColumns } from './utils/phenotype';
import { getProfilItems } from './utils/profil';
import { getSummaryItems } from './utils/summary';

enum SectionId {
  SUMMARY = 'summary',
  PROFIL = 'profil',
  FAMILY = 'family',
  DIAGNOSIS = 'diagnosis',
  PHENOTYPE = 'phenotype',
  BIOSPECIMEN = 'biospecimen',
  DATAFILE = 'datafile',
}

const ParticipantEntity = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useParticipantEntity({
    field: 'participant_id',
    values: [id],
  });
  const { members, loading: memberLoading } = useParticipantsFamily(data?.families_id || '');

  const links: IAnchorLink[] = [
    { href: `#${SectionId.SUMMARY}`, title: intl.get('screen.participantEntity.summary.title') },
    { href: `#${SectionId.PROFIL}`, title: intl.get('screen.participantEntity.profil.title') },
    { href: `#${SectionId.FAMILY}`, title: intl.get('screen.participantEntity.family.title') },
    {
      href: `#${SectionId.DIAGNOSIS}`,
      title: intl.get('screen.participantEntity.diagnosis.title'),
    },
    {
      href: `#${SectionId.PHENOTYPE}`,
      title: intl.get('screen.participantEntity.phenotype.title'),
    },
    // { href: `#${SectionId.BIOSPECIMEN}`, title: intl.get('screen.participantEntity.biospecimen.title') },
    { href: `#${SectionId.DATAFILE}`, title: intl.get('screen.participantEntity.dataFile.title') },
  ];

  return (
    <EntityPageWrapper
      pageId="particpant-entity-page"
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
            <Button type="primary" icon={<DownloadOutlined />}>
              {intl.get('screen.participantEntity.downloadData')}
            </Button>
          }
        />
        <EntityDescriptions
          id={SectionId.SUMMARY}
          loading={loading}
          title={intl.get('screen.participantEntity.summary.title')}
          header={intl.get('screen.participantEntity.summary.title')}
          descriptions={getSummaryItems(data)}
        />

        <EntityDescriptions
          id={SectionId.PROFIL}
          loading={loading}
          title={intl.get('screen.participantEntity.profil.title')}
          header={intl.get('screen.participantEntity.profil.title')}
          descriptions={getProfilItems(data)}
        />

        {data?.families_id && (
          <EntityTable
            id={SectionId.SUMMARY}
            loading={memberLoading}
            data={members}
            title={intl.get('screen.participantEntity.family.title')}
            header={
              <>
                {intl.get('screen.participantEntity.family.title')}
                <Button
                  type="link"
                  onClick={() => {
                    history.push(STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS);
                    addQuery({
                      queryBuilderId: DATA_EXPLORATION_QB_ID,
                      query: generateQuery({
                        newFilters: [
                          generateValueFilter({
                            field: 'families_id',
                            value: [data.families_id],
                            index: INDEXES.PARTICIPANT,
                          }),
                        ],
                      }),
                    });
                  }}
                >
                  ({data?.families_id})
                </Button>
              </>
            }
            columns={getFamilyDefaultColumns()}
          />
        )}

        <EntityTable
          id={SectionId.DIAGNOSIS}
          loading={loading}
          data={hydrateResults(data?.diagnosis?.hits?.edges || [])}
          title={intl.get('screen.participantEntity.diagnosis.title')}
          header={intl.get('screen.participantEntity.diagnosis.title')}
          columns={getDiagnosisDefaultColumns()}
        />

        <EntityTable
          id={SectionId.PHENOTYPE}
          loading={loading}
          data={hydrateResults(data?.phenotype?.hits?.edges || [])}
          title={intl.get('screen.participantEntity.phenotype.title')}
          header={intl.get('screen.participantEntity.phenotype.title')}
          columns={getPhenotypeDefaultColumns()}
        />

        {/* <EntityTable
          id={SectionId.BIOSPECIMEN}
          loading={loading}
          data={data}
          title={intl.get('screen.participantEntity.biospecimen.title')}
          defaultColumns={familyDefaultColumns}
        /> */}
        {/* 
        <EntityTable
          id={SectionId.DATAFILE}
          loading={loading}
          data={hydrateResults(data?.files.hits.edges || [])}
          title={intl.get('screen.participantEntity.dataFile.title')}
          header={intl.get('screen.participantEntity.dataFile.title')}
          columns={dataFileDefaultColumns}
        /> */}
      </>
    </EntityPageWrapper>
  );
};

export default ParticipantEntity;
