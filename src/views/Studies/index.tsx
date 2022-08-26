import ProTable from '@ferlab/ui/core/components/ProTable';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Space, Typography } from 'antd';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { useStudies } from 'graphql/studies/actions';
import { getProTableDictionary } from 'utils/translation';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import { STATIC_ROUTES } from 'utils/routes';
import { IStudyEntity } from 'graphql/studies/models';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import styles from './index.module.scss';
import SideBarFacet from './SideBarFacet';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import FilterList from 'components/uiKit/FilterList';
import { STUDIES_QB_ID } from './utils/constant';
import { FilterInfo } from 'components/uiKit/FilterList/types';

const { Title } = Typography;

const enum DataCategory {
  METABOLOMIC = 'Metabolomic',
  GENOMIC = 'Genomic',
  PROTEOMIC = 'Proteomic',
  TRANSCRIPTOMIC = 'Transcriptomic',
  CLINICAL = 'Clinical',
  IMMUNE_MAP = 'Immune-Map',
}

const hasDataCategory = (dataCategory: string[], category: DataCategory) =>
  dataCategory ? dataCategory.includes(category) ? <CheckOutlined /> : undefined : undefined;

const filterInfo: FilterInfo = {
  groups: [
    {
      facets: [
        'external_id',
        'domain',
        'program',
        'attribution',
        'data_category',
        'experimental_strategy',
        'family_data',
      ],
    },
  ],
};

const columns: ProColumnType<any>[] = [
  {
    key: 'study_id',
    title: 'Study Code',
    render: (record: IStudyEntity) => (
      <ExternalLink href={record.website}>{record.study_id}</ExternalLink>
    ),
  },
  {
    key: 'study_name',
    title: 'Name',
    dataIndex: 'study_name',
    width: 500,
  },
  {
    key: 'program',
    title: 'Program',
    dataIndex: 'program',
  },
  {
    key: 'external_id',
    title: 'dbGaP',
    dataIndex: 'external_id',
    render: (external_id: string) => (
      <ExternalLink
        href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${external_id}`}
      >
        {external_id}
      </ExternalLink>
    ),
  },
  {
    key: 'participant_count',
    title: 'Participants',
    render: (record: IStudyEntity) => {
      const participantCount = record.participant_count;

      return participantCount ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'study_id',
                    value: [record.study_id],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {participantCount}
        </Link>
      ) : (
        participantCount || 0
      );
    },
  },
  {
    key: 'family_count',
    title: 'Families',
    dataIndex: 'family_count',
  },
  {
    key: 'biospecimen_count',
    title: 'Biospecimens',
    render: (record: IStudyEntity) => {
      const biospecimenCount = record.biospecimen_count;

      return biospecimenCount ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'study_id',
                    value: [record.study_id],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {biospecimenCount}
        </Link>
      ) : (
        biospecimenCount || 0
      );
    },
  },
  {
    key: 'genomic',
    title: DataCategory.GENOMIC,
    align: 'center',
    render: (record: IStudyEntity) => hasDataCategory(record.data_category, DataCategory.GENOMIC),
  },
  {
    key: 'transcriptomic',
    title: DataCategory.TRANSCRIPTOMIC,
    align: 'center',
    render: (record: IStudyEntity) =>
      hasDataCategory(record.data_category, DataCategory.TRANSCRIPTOMIC),
  },
  {
    key: 'proteomic',
    title: 'Proteomic',
    align: 'center',
    render: (record: IStudyEntity) => hasDataCategory(record.data_category, DataCategory.PROTEOMIC),
  },
  {
    key: 'immune_map',
    title: 'Immune Map',
    align: 'center',
    render: (record: IStudyEntity) =>
      hasDataCategory(record.data_category, DataCategory.IMMUNE_MAP),
  },
  {
    key: 'metabolic',
    title: 'Metabolomic',
    align: 'center',
    render: (record: IStudyEntity) =>
      hasDataCategory(record.data_category, DataCategory.METABOLOMIC),
  },
];

const Studies = () => {
  const { loading, data, total } = useStudies({
    sort: [
      {
        field: 'study_id',
        order: 'desc',
      },
    ],
  });
  const studiesMappingResults = useGetExtendedMappings(INDEXES.STUDY);

  console.log('data', data); //TODO: to remove
  console.log('total', total); //TODO: to remove
  console.log('studiesMappingResults', studiesMappingResults); //TODO: to remove

  return (
    <div className={styles.studiesPage}>
      <SideBarFacet extendedMappingResults={studiesMappingResults} filterInfo={filterInfo} />
      <Space direction="vertical" size={16} className={styles.studiesWrapper}>
        <Title className={styles.title} level={4}>
          {intl.get('screen.studies.title')}
        </Title>
        <GridCard
          content={
            <ProTable
              tableId="studies"
              wrapperClassName={styles.tableWrapper}
              size="small"
              bordered
              columns={columns}
              dataSource={data}
              loading={loading}
              pagination={false}
              headerConfig={{
                itemCount: {
                  pageIndex: 1,
                  pageSize: 20,
                  total,
                },
              }}
              dictionary={getProTableDictionary()}
            />
          }
        />
      </Space>
    </div>
  );
};

export default Studies;
