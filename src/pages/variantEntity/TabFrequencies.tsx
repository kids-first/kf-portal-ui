/* eslint-disable react/display-name */
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Card, Space, Spin, Table, Tooltip } from 'antd';

import { addToSqons } from 'common/sqonUtils';
import EmptyMessage, { DISPLAY_WHEN_EMPTY_DATUM } from 'components/Variants/Empty';
import ServerError from 'components/Variants/ServerError';
import {
  FreqCombined,
  FreqInternal,
  Frequencies,
  Study,
  StudyInfo,
} from 'store/graphql/variants/models';
import { useTabFrequenciesData } from 'store/graphql/variants/tabActions';
import { RootState } from 'store/rootState';
import { Sqon } from 'store/sqon';
import {
  formatQuotientOrElse,
  formatQuotientToExponentialOrElse,
  toExponentialNotation,
} from 'utils';

import { createQueryInCohortBuilder } from '../../store/actionCreators/virtualStudies';
import { DispatchVirtualStudies } from '../../store/virtualStudiesTypes';

import TableSummaryKfStudies from './TableSummaryKfStudies';

const MIN_N_OF_PARTICIPANTS_FOR_LINK = 10;

type OwnProps = {
  variantId: string;
};

type FrequencyTabTableContainerState = {
  currentVirtualStudy: Sqon[];
};

type InternalRow = {
  frequencies: FreqInternal;
  key: string;
  participantTotalNumber: number;
  participant_ids: null | string[];
  participant_number: number;
  study_id: string;
};

type ExternalCohortDatum = number | null;

type Row = {
  cohort: {
    cohortName: string;
    link?: string;
  };
  alt: ExternalCohortDatum;
  altRef: ExternalCohortDatum;
  homozygotes: ExternalCohortDatum;
  frequency: ExternalCohortDatum;
  key: string;
};

type Rows = Row[];
const canMakeParticipantsLink = (nOfParticipants: number) =>
  nOfParticipants && nOfParticipants >= MIN_N_OF_PARTICIPANTS_FOR_LINK;

const hasAtLeastOneParticipantsLink = (rows: InternalRow[]) =>
  (rows || []).some((row: InternalRow) => canMakeParticipantsLink(row.participant_number));

const internalColumns = (
  globalStudies: StudyInfo[],
  onLinkClick: (sqons: Sqon[]) => void,
  sqons: Sqon[],
  hasParticipantsLinks: boolean,
) => [
  {
    title: 'Studies',
    dataIndex: 'study_id',
    render: (variantStudyId: string) => {
      const study = globalStudies.find((s) => s.id === variantStudyId);
      return study?.code || variantStudyId;
    },
  },
  {
    title: 'Domain',
    dataIndex: 'study_id',
    render: (variantStudyId: string) => {
      const study = globalStudies.find((s) => s.id === variantStudyId);
      return study?.domain.join(', ') || DISPLAY_WHEN_EMPTY_DATUM;
    },
  },
  {
    title: hasParticipantsLinks ? (
      <>
        Participants{' '}
        <Tooltip
          title={
            'Due to participant confidentiality, links may return a smaller number than displayed.'
          }
        >
          <InfoCircleOutlined />
        </Tooltip>
      </>
    ) : (
      'Participants'
    ),
    dataIndex: '',
    render: (row: InternalRow) => {
      const participantsNumber = row.participant_number;
      const participantsTotal = row.participantTotalNumber;
      return canMakeParticipantsLink(participantsNumber) ? (
        <>
          <Link
            to={'/explore'}
            href={'#top'}
            onClick={() => {
              const study = globalStudies.find((s) => s.id === row.study_id);
              if (study) {
                onLinkClick(
                  addToSqons({
                    fieldsWValues: [{ field: 'kf_id', value: row.participant_ids || [] }],
                    sqons: sqons,
                  }),
                );
              }
              const toTop = document.getElementById('main-page-container');
              toTop?.scrollTo(0, 0);
            }}
          >
            {participantsNumber}
          </Link>
          {participantsTotal ? ` / ${participantsTotal}` : ''}
        </>
      ) : (
        formatQuotientOrElse(participantsNumber, participantsTotal)
      );
    },
  },
  {
    title: 'Frequency',
    dataIndex: '',
    render: (row: InternalRow) => {
      const participantsNumber = row.participant_number;
      const participantsTotal = row.participantTotalNumber;
      return formatQuotientToExponentialOrElse(participantsNumber, participantsTotal);
    },
  },
  {
    title: 'ALT Alleles',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.ac,
    width: '14%',
  },
  {
    title: 'Homozygotes',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.homozygotes,
    width: '14%',
  },
];

const displayDefaultIfNeeded = (datum: ExternalCohortDatum) =>
  datum == null ? DISPLAY_WHEN_EMPTY_DATUM : datum;

const externalColumns = [
  {
    title: 'Cohort',
    dataIndex: 'cohort',
    render: (cohort: { cohortName: string; link?: string }) => {
      const cohortName = cohort.cohortName;
      if (['TopMed', 'Gnomad Genomes (v3)'].includes(cohortName)) {
        return (
          <a href={cohort.link} target="_blank" rel="noopener noreferrer">
            {cohortName}
          </a>
        );
      }
      return cohortName;
    },
  },
  {
    title: 'ALT Allele',
    dataIndex: 'alt',
    render: displayDefaultIfNeeded,
    width: '14%',
  },
  {
    title: 'Alleles (ALT + REF)',
    dataIndex: 'altRef',
    render: displayDefaultIfNeeded,
    width: '14%',
  },
  {
    title: 'Homozygote',
    dataIndex: 'homozygotes',
    render: displayDefaultIfNeeded,
    width: '14%',
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    render: displayDefaultIfNeeded,
    width: '14%',
  },
];

const makeRowFromFrequencies = (frequencies: Frequencies, locus: string): Rows => {
  if (!frequencies || Object.keys(frequencies).length === 0) {
    return [];
  }

  const topmed = frequencies.topmed || {};
  const gnomadGenomes3 = frequencies.gnomad_genomes_3_0 || {};
  const gnomadGenomes2_1 = frequencies.gnomad_genomes_2_1 || {};
  const gnomadExomes2_1 = frequencies.gnomad_exomes_2_1 || {};
  const oneThousandsGenomes = frequencies.one_thousand_genomes || {};

  return [
    {
      cohort: {
        cohortName: 'TopMed',
        link: `https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/${locus}`,
      },
      alt: topmed.ac,
      altRef: topmed.an,
      homozygotes: topmed.homozygotes,
      frequency: toExponentialNotation(topmed.af),
    },
    {
      cohort: {
        cohortName: 'Gnomad Genomes (v3)',
        link: `https://gnomad.broadinstitute.org/variant/${locus}?dataset=gnomad_r3`,
      },
      alt: gnomadGenomes3.ac,
      altRef: gnomadGenomes3.an,
      homozygotes: gnomadGenomes3.homozygotes,
      frequency: toExponentialNotation(gnomadGenomes3.af),
    },
    {
      cohort: {
        cohortName: 'Gnomad Genomes (v2.1)',
      },
      alt: gnomadGenomes2_1.ac,
      altRef: gnomadGenomes2_1.an,
      homozygotes: gnomadGenomes2_1.homozygotes,
      frequency: toExponentialNotation(gnomadGenomes2_1.af),
    },
    {
      cohort: {
        cohortName: 'Gnomad Exomes (v2.1)',
      },
      alt: gnomadExomes2_1.ac,
      altRef: gnomadExomes2_1.an,
      homozygotes: gnomadExomes2_1.homozygotes,
      frequency: toExponentialNotation(gnomadExomes2_1.af),
    },
    {
      cohort: {
        cohortName: '1000 Genomes',
      },
      alt: oneThousandsGenomes.ac,
      altRef: oneThousandsGenomes.an,
      homozygotes: oneThousandsGenomes.homozygotes,
      frequency: toExponentialNotation(oneThousandsGenomes.af),
    },
  ].map((row, index) => ({ ...row, key: `${index}` }));
};

const makeInternalCohortsRows = (rows: Study[]) =>
  rows.map((row: Study, index: number) => ({ ...row, key: `${index}` }));

const hasAtLeastOneTruthyProperty = (obj: Omit<Row, 'key' | 'cohort'>) =>
  Object.values(obj).some((e) => e);

const isExternalCohortsTableEmpty = (rows: Rows) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  rows.every(({ cohort, key, ...visibleRow }: Row) => !hasAtLeastOneTruthyProperty(visibleRow));

const mapDispatch = (dispatch: DispatchVirtualStudies) => ({
  onClickStudyLink: (sqons: Sqon[]) => dispatch(createQueryInCohortBuilder(sqons)),
});

const mapState = (state: RootState): FrequencyTabTableContainerState => ({
  currentVirtualStudy: state.currentVirtualStudy.sqons,
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux;

const TabFrequencies = (props: Props) => {
  const { loading, data, error } = useTabFrequenciesData(props.variantId);

  if (error) {
    return <ServerError />;
  }

  const {
    variantStudies,
    frequencies,
    globalStudies,
    locus,
    participantTotalNumber,
    participantNumber,
  } = data;

  const internalFrequencies: FreqCombined | undefined = data?.frequencies?.internal?.upper_bound_kf;

  const externalCohortsRows = makeRowFromFrequencies(frequencies, locus);
  const hasEmptyCohorts = isExternalCohortsTableEmpty(externalCohortsRows);

  const internalCohortRows = makeInternalCohortsRows(variantStudies);
  const hasInternalCohorts = internalCohortRows.length > 0;

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Card title="Kids First Studies">
            {hasInternalCohorts ? (
              <Table
                dataSource={makeInternalCohortsRows(variantStudies)}
                columns={internalColumns(
                  globalStudies,
                  props.onClickStudyLink,
                  props.currentVirtualStudy,
                  hasAtLeastOneParticipantsLink(variantStudies),
                )}
                summary={() => (
                  <TableSummaryKfStudies
                    variantStudies={variantStudies}
                    onClickStudyLink={props.onClickStudyLink}
                    currentVirtualStudy={props.currentVirtualStudy}
                    participantNumber={participantNumber}
                    altAlleles={internalFrequencies?.ac}
                    homozygotes={internalFrequencies?.homozygotes}
                    participantTotalNumber={participantTotalNumber}
                  />
                )}
                pagination={false}
              />
            ) : (
              <EmptyMessage />
            )}
          </Card>
          <Card title="External Cohorts">
            {hasEmptyCohorts ? (
              <EmptyMessage />
            ) : (
              <Table
                dataSource={externalCohortsRows}
                columns={externalColumns}
                pagination={false}
              />
            )}
          </Card>
        </Space>
      </StackLayout>
    </Spin>
  );
};

const Connected = connector(TabFrequencies);

export default Connected;
