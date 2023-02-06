import intl from 'react-intl-universal';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ProColumnType, TProTableSummary } from '@ferlab/ui/core/components/ProTable/types';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import {
  IVariantEntity,
  IVariantFrequencies,
  IVariantStudyEntity,
  IVariantStudyFrequencies,
} from '@ferlab/ui/core/pages//EntityPage/type';
import {
  formatQuotientOrElse,
  formatQuotientToExponentialOrElse,
} from '@ferlab/ui/core/utils/numberUtils';
import { Button, Space, Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { STATIC_ROUTES } from 'utils/routes';

export const MIN_N_OF_PARTICIPANTS_FOR_LINK = 10;

import styles from '../index.module.scss';

type TInternalRow = {
  frequencies: IVariantFrequencies;
  key: string;
  participant_total_number: number;
  participant_ids: null | string[];
  participant_number: number;
  study_id: string;
};

export const getFrequenciesItems = (): ProColumnType[] => [
  {
    dataIndex: 'study_id',
    key: 'study_id',
    title: intl.get('screen.variants.frequencies.studies'),
    render: (study_id: string) => study_id,
  },
  {
    title: intl.get('screen.variants.frequencies.participants'),
    iconTitle: (
      <Space>
        <Tooltip
          className={styles.dotted}
          title={intl.get('screen.variants.frequencies.participantsTooltip')}
        >
          {intl.get('screen.variants.frequencies.participants')}
        </Tooltip>
        <Tooltip title={intl.get('screen.variants.frequencies.participantsInfoIconTooltip')}>
          <InfoCircleOutlined />
        </Tooltip>
      </Space>
    ),
    key: 'participants',
    render: (row: TInternalRow) =>
      row.participant_number >= MIN_N_OF_PARTICIPANTS_FOR_LINK ? (
        <>
          <Button
            type="link"
            href={STATIC_ROUTES.DATA_EXPLORATION}
            onClick={() => {
              updateActiveQueryField({
                field: 'participant_id',
                index: INDEXES.PARTICIPANT,
                queryBuilderId: DATA_EXPLORATION_QB_ID,
                value: row.participant_ids || [],
              });
            }}
          >
            {row.participant_number}
          </Button>
          {row.participant_total_number ? ` / ${row.participant_total_number}` : ''}
        </>
      ) : (
        formatQuotientOrElse(row.participant_number, row.participant_total_number)
      ),
  },
  {
    title: intl.get('screen.variants.frequencies.frequency'),
    tooltip: intl.get('screen.variants.frequencies.frequencyTooltip'),
    key: 'frequency',
    render: (row: TInternalRow) =>
      formatQuotientToExponentialOrElse(row.participant_number, row.participant_total_number),
  },
  {
    title: intl.get('screen.variants.frequencies.altAlleles'),
    tooltip: intl.get('screen.variants.frequencies.altAllelesTooltip'),
    dataIndex: 'frequencies',
    key: 'upper_bound_kf_ac',
    render: (frequencies: IVariantStudyFrequencies) => frequencies?.upper_bound_kf?.ac || 0,
    width: '14%',
  },
  {
    title: intl.get('screen.variants.frequencies.homozygotes'),
    tooltip: intl.get('screen.variants.frequencies.homozygotesTooltip'),
    dataIndex: 'frequencies',
    key: 'upper_bound_kf_homozygotes',
    render: (frequencies: IVariantStudyFrequencies) =>
      frequencies?.upper_bound_kf?.homozygotes || 0,
    width: '14%',
  },
];

export const getFrequenciesTableSummaryColumns = (
  variant?: IVariantEntity,
  studies?: IVariantStudyEntity[],
): TProTableSummary[] => {
  const hasparticipantlink: boolean =
    studies?.some(
      (s: IVariantStudyEntity) => s.participant_number >= MIN_N_OF_PARTICIPANTS_FOR_LINK,
    ) || false;

  return [
    {
      index: 0,
      value: intl.get('screen.variants.frequencies.total'),
    },
    {
      index: 1,
      value: hasparticipantlink ? (
        <>
          <Button
            type="link"
            href={STATIC_ROUTES.DATA_EXPLORATION}
            onClick={() => {
              updateActiveQueryField({
                field: 'participant_id',
                index: INDEXES.PARTICIPANT,
                queryBuilderId: DATA_EXPLORATION_QB_ID,
                value: (studies || []).map((s) => s.participant_ids || []).flat(),
              });
            }}
          >
            {variant?.participant_number}
          </Button>
          {variant?.participant_total_number ? ` / ${variant?.participant_total_number}` : ''}
        </>
      ) : (
        formatQuotientOrElse(
          variant?.participant_number || 0,
          variant?.participant_total_number || 0,
        )
      ),
    },
    {
      index: 2,
      value: formatQuotientToExponentialOrElse(
        variant?.participant_number || 0,
        variant?.participant_total_number || 0,
      ),
    },
    {
      index: 3,
      value: variant?.frequencies?.internal?.upper_bound_kf.ac || 0,
    },
    {
      index: 4,
      value: variant?.frequencies?.internal?.upper_bound_kf.homozygotes || 0,
    },
  ];
};

export const getPublicCohorts = (): ProColumnType[] => [
  {
    dataIndex: 'cohort',
    key: 'cohort',
    render: (cohort: { cohortName: string; link?: string }) =>
      cohort.link ? (
        <a href={cohort.link} rel="noopener noreferrer" target="_blank">
          {cohort.cohortName}
        </a>
      ) : (
        cohort.cohortName
      ),
    title: intl.get('screen.variants.frequencies.cohort'),
  },
  {
    dataIndex: 'alt',
    key: 'alt',
    render: (alt: string) => alt || TABLE_EMPTY_PLACE_HOLDER,
    title: intl.get('screen.variants.frequencies.altAlleles'),
    tooltip: intl.get('screen.variants.frequencies.altAllelesTooltip'),
  },
  {
    dataIndex: 'altRef',
    key: 'altRef',
    render: (altRef: string) => altRef || TABLE_EMPTY_PLACE_HOLDER,
    title: intl.get('screen.variants.frequencies.altRef'),
    tooltip: intl.get('screen.variants.frequencies.altRefTooltip'),
  },
  {
    dataIndex: 'homozygotes',
    key: 'homozygotes',
    render: (homozygotes: string) => homozygotes || TABLE_EMPTY_PLACE_HOLDER,
    title: intl.get('screen.variants.frequencies.homozygotes'),
    tooltip: intl.get('screen.variants.frequencies.homozygotesTooltip'),
  },
  {
    dataIndex: 'frequency',
    key: 'frequency',
    render: (frequency: string) => frequency || TABLE_EMPTY_PLACE_HOLDER,
    title: intl.get('screen.variants.frequencies.frequency'),
  },
];
