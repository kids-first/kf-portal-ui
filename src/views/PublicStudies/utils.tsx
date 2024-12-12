import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { numberWithCommas } from '@ferlab/ui/core/utils/numberUtils';
import { INDEXES } from 'graphql/constants';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { DataCategory, hasDataCategory } from 'views/Studies';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IStudiesStatistic } from 'services/api/arranger/models';
import { STATIC_ROUTES } from 'utils/routes';

export const SCROLL_WRAPPER_ID = 'public-studies-scroll-wrapper';
export const TABLE_ID = 'public-studies';

type ColumnsProps = {
  manageLoginModal: (isOpen: boolean) => void;
  manageRedirectUri: (uri: string) => void;
};

export const getColumns = ({
  manageLoginModal,
  manageRedirectUri,
}: ColumnsProps): ProColumnType<any>[] => [
  {
    key: 'study_code',
    dataIndex: 'study_code',
    title: intl.get('entities.study.study_code'),
    render: (study_code: string) => study_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'study_name',
    title: intl.get('entities.study.study_name'),
    dataIndex: 'study_name',
    width: 400,
    render: (study_name: string) => study_name || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'program',
    title: intl.get('entities.study.program'),
    dataIndex: 'program',
    render: (program: string) => program || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'domain',
    title: intl.get('entities.study.domain'),
    dataIndex: 'domain',
    render: (domain: string) =>
      intl.get(`facets.options.domain.${domain}`, domain) || domain || TABLE_EMPTY_PLACE_HOLDER,
    width: 180,
  },
  {
    key: 'external_id',
    title: intl.get('entities.study.external_id'),
    dataIndex: 'external_id',
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
    title: intl.get('entities.study.participant_count'),
    render: (record: IStudiesStatistic) => {
      const participantCount = record.participant_count;
      return participantCount ? (
        <a
          onClick={() => {
            manageRedirectUri(STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS);
            manageLoginModal(true);
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
            });
          }}
        >
          {numberWithCommas(participantCount)}
        </a>
      ) : (
        participantCount || 0
      );
    },
  },
  {
    key: 'family_count',
    title: intl.get('entities.study.family_count'),
    dataIndex: 'family_count',
    render: (family_count: number) =>
      family_count ? numberWithCommas(family_count) : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'genomic',
    title: intl.get('entities.study.genomic'),
    align: 'center',
    render: (record: IStudiesStatistic) =>
      hasDataCategory(record.data_category, DataCategory.GENOMICS) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'transcriptomic',
    title: intl.get('entities.study.transcriptomic'),
    align: 'center',
    render: (record: IStudiesStatistic) =>
      hasDataCategory(record.data_category, DataCategory.TRANSCRIPTOMICS) ||
      TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging',
    title: intl.get('entities.study.imaging'),
    align: 'center',
    render: (record: IStudiesStatistic) =>
      hasDataCategory(record.data_category, DataCategory.IMAGING) || TABLE_EMPTY_PLACE_HOLDER,
  },
];
