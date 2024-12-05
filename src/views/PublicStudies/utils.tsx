import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { numberWithCommas } from '@ferlab/ui/core/utils/numberUtils';
import { DataCategory, hasDataCategory } from 'views/Studies';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IStudiesStatistic } from 'services/api/arranger/models';

export const SCROLL_WRAPPER_ID = 'public-studies-scroll-wrapper';
export const TABLE_ID = 'public-studies';

export const getColumns = (): ProColumnType<any>[] => [
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
    title: intl.get('entities.study.participant_count'),
    sorter: { multiple: 1 },
    render: (record: IStudiesStatistic) => {
      const participantCount = record.participant_count;
      //TODO open modal
      return participantCount ? <a>{numberWithCommas(participantCount)}</a> : participantCount || 0;
    },
  },
  {
    key: 'family_count',
    title: intl.get('entities.study.family_count'),
    dataIndex: 'family_count',
    sorter: { multiple: 1 },
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
