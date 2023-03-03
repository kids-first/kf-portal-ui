import intl from 'react-intl-universal';
import { useHistory, useParams } from 'react-router-dom';
import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import EntityPageWrapper, {
  EntityDescriptions,
  EntityTableMultiple,
  EntityTitle,
} from '@ferlab/ui/core/pages/EntityPage';
import EntityTable from '@ferlab/ui/core/pages/EntityPage/EntityTable';
import { Button, Tag } from 'antd';
import { INDEXES } from 'graphql/constants';
import { useParticipantEntity } from 'graphql/participants/actions';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { STATIC_ROUTES } from 'utils/routes';

import { getDiagnosisDefaultColumns } from './utils/diagnosis';
import { getFamilyDefaultColumns } from './utils/family';
import { getPhenotypeDefaultColumns } from './utils/phenotype';
import { getProfilItems } from './utils/profil';
import { getSummaryItems } from './utils/summary';
import { getFilesDataTypeInfo, getFilesByExperimentalStrategy, getDataTypeColumns, getExperimentalStrategyColumns } from './utils/files';
import { IFileEntity } from 'graphql/files/models';
import { fetchReport } from 'store/report/thunks';
import { generateSelectionSqon } from 'views/DataExploration/utils/selectionSqon';
import { useDispatch } from 'react-redux';
import { ReportType } from 'services/api/reports/models';

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
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useParticipantEntity({
    field: 'participant_id',
    values: [id],
  });
  const familyMembers = hydrateResults(data?.family?.family_relations?.hits?.edges || []);
  const files: IFileEntity[] = data?.files?.hits.edges.map(({ node }) => node) || [];
  const dataTypeInfoData = getFilesDataTypeInfo(files, data?.participant_id);
  const experimentalStrategyData = getFilesByExperimentalStrategy(
    files,
    data?.participant_id,
  );

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
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => {
              dispatch(
                fetchReport({
                  data: {
                    sqon: generateSelectionSqon(INDEXES.PARTICIPANT, [id]),
                    name: ReportType.CLINICAL_DATA,
                  },
                }),
              )
            }}>
              {intl.get('screen.participantEntity.downloadData')}
            </Button>
          }
        />
        <EntityDescriptions
          id={SectionId.SUMMARY}
          loading={loading}
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
            loading={loading}
            data={familyMembers}
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

        <EntityTableMultiple
          id={id}
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
