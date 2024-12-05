import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { INDEXES } from 'graphql/constants';
import { IStudyEntity } from 'graphql/studies/models';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import { STATIC_ROUTES } from 'utils/routes';
import { numberWithCommas } from 'utils/string';

import PageContent from './components/PageContent';
import SideBarFacet from './components/SideBarFacet';
import { SCROLL_WRAPPER_ID } from './utils/constant';

import styles from './index.module.css';

export const enum DataCategory {
  METABOLOMIC = 'Metabolomics',
  GENOMICS = 'Genomics',
  PROTEOMICS = 'Proteomics',
  TRANSCRIPTOMICS = 'Transcriptomics',
  CLINICAL = 'Clinical',
  IMMUNE_MAP = 'Immune-Map',
  IMAGING = 'Imaging',
}

export const hasDataCategory = (dataCategory: string[], category: DataCategory) =>
  dataCategory && dataCategory.includes(category) ? <CheckOutlined /> : undefined;

const filterInfo: FilterInfo = {
  defaultOpenFacets: ['program', 'domain', 'data_category', 'experimental_strategy', 'family_data'],
  groups: [
    {
      facets: ['program', 'domain', 'data_category', 'experimental_strategy', 'family_data'],
    },
  ],
};

const columns: ProColumnType<any>[] = [
  {
    key: 'study_code',
    title: 'Code',
    sorter: { multiple: 1 },
    render: (record: IStudyEntity) =>
      record?.website ? (
        <ExternalLink href={record.website}>{record.study_code}</ExternalLink>
      ) : (
        record?.study_code || TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'study_name',
    sorter: { multiple: 1 },
    title: 'Name',
    dataIndex: 'study_name',
    width: 500,
  },
  {
    key: 'program',
    title: 'Program',
    dataIndex: 'program',
    render: (program: string) => program || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'domain',
    title: 'Domain',
    dataIndex: 'domain',
    render: (domain: string) =>
      intl.get(`facets.options.domain.${domain}`, domain) || domain || TABLE_EMPTY_PLACE_HOLDER,
    width: 182,
  },
  {
    key: 'external_id',
    title: 'dbGaP',
    dataIndex: 'external_id',
    sorter: { multiple: 1 },
    render: (externalId: string) =>
      externalId ? (
        <ExternalLink
          href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${externalId}`}
        >
          {externalId}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'participant_count',
    title: 'Participants',
    sorter: { multiple: 1 },
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
                    field: 'study.study_code',
                    value: [record.study_code],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {numberWithCommas(participantCount)}
        </Link>
      ) : (
        participantCount || 0
      );
    },
  },
  {
    key: 'biospecimen_count',
    title: 'Biospecimens',
    sorter: { multiple: 1 },
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
                    field: 'study.study_code',
                    value: [record.study_code],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {numberWithCommas(biospecimenCount)}
        </Link>
      ) : (
        biospecimenCount || 0
      );
    },
  },
  {
    key: 'family_count',
    title: 'Families',
    dataIndex: 'family_count',
    sorter: { multiple: 1 },
    render: (family_count: number) =>
      family_count ? numberWithCommas(family_count) : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'genomic',
    title: 'Genomics',
    align: 'center',
    render: (record: IStudyEntity) =>
      hasDataCategory(record.data_category, DataCategory.GENOMICS) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'transcriptomic',
    title: 'Transcriptomics',
    align: 'center',
    render: (record: IStudyEntity) =>
      hasDataCategory(record.data_category, DataCategory.TRANSCRIPTOMICS) ||
      TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging',
    title: 'Imaging',
    align: 'center',
    render: (record: IStudyEntity) =>
      hasDataCategory(record.data_category, DataCategory.IMAGING) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'proteomic',
    title: 'Proteomics',
    align: 'center',
    render: (record: IStudyEntity) =>
      hasDataCategory(record.data_category, DataCategory.PROTEOMICS) || TABLE_EMPTY_PLACE_HOLDER,
  },
];

const Studies = () => {
  const studiesMappingResults = useGetExtendedMappings(INDEXES.STUDIES);

  return (
    <div className={styles.studiesPage}>
      <SideBarFacet
        extendedMappingResults={studiesMappingResults}
        filterInfo={filterInfo}
        filterWithFooter={false}
      />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent defaultColumns={columns} extendedMappingResults={studiesMappingResults} />
      </ScrollContent>
    </div>
  );
};

export default Studies;
