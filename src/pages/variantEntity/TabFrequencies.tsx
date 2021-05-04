import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Card, Space, Spin, Table } from 'antd';
// @ts-ignore
import { compose } from 'recompose';

import { addToSqons } from 'common/sqonUtils';
import EmptyMessage from 'components/Variants/EmptyTable';
import ServerError from 'components/Variants/ServerError';
import { createQueryInCohortBuilder, DispatchStoryPage } from 'store/actionCreators/studyPage';
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

type Row = {
  cohort: {
    cohortName: string;
    link?: string;
  };
  alt: number | null;
  altRef: number | null;
  homozygotes: number | null;
  frequency: number | null;
  key: string;
};

type Rows = Row[];

const internalColumns = (
  globalStudies: StudyInfo[],
  onLinkClick: (sqons: Sqon[]) => void,
  sqons: Sqon[],
) => [
  {
    title: 'Studies',
    dataIndex: 'study_id',
    // eslint-disable-next-line react/display-name
    render: (variantStudyId: string) => {
      const study = globalStudies.find((s) => s.id === variantStudyId);
      return study?.code || variantStudyId;
    },
  },
  {
    title: 'Domain',
    dataIndex: 'study_id',
    // eslint-disable-next-line react/display-name
    render: (variantStudyId: string) => {
      const study = globalStudies.find((s) => s.id === variantStudyId);
      return study?.domain.join(', ') || '';
    },
  },
  {
    title: 'Participants',
    dataIndex: '',
    // eslint-disable-next-line react/display-name
    render: (row: InternalRow) => {
      const participantsNumber = row.participant_number;
      const participantsTotal = row.participantTotalNumber;

      return participantsNumber && participantsNumber >= MIN_N_OF_PARTICIPANTS_FOR_LINK ? (
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
    // eslint-disable-next-line react/display-name
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
    width: '14%',
  },
  {
    title: 'Alleles (ALT + REF)',
    dataIndex: 'altRef',
    width: '14%',
  },
  {
    title: 'Homozygote',
    dataIndex: 'homozygotes',
    width: '14%',
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
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

const hasTruthyProperties = (obj: Omit<Row, 'key' | 'cohort'>) => Object.values(obj).some((e) => e);

const filterRows = (rows: Rows) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (rows || []).filter(({ cohort, key, ...visibleRow }: Row) => hasTruthyProperties(visibleRow));

const mapDispatch = (dispatch: DispatchStoryPage) => ({
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

  const filteredCohortsRows = compose(filterRows, makeRowFromFrequencies)(frequencies, locus);
  const hasEmptyCohorts = filteredCohortsRows.length === 0;

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Card title="Kids First Studies">
            <Table
              dataSource={makeInternalCohortsRows(variantStudies)}
              columns={internalColumns(
                globalStudies,
                props.onClickStudyLink,
                props.currentVirtualStudy,
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
          </Card>
          <Card title="External Cohorts">
            {hasEmptyCohorts ? (
              <EmptyMessage />
            ) : (
              <Table
                dataSource={filteredCohortsRows}
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
