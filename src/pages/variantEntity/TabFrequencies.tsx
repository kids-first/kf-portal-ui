import React from 'react';
import { Button, Card, Space, Spin, Table } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabFrequenciesData } from 'store/graphql/variants/tabActions';
import {
  FreqCombined,
  FreqInternal,
  Frequencies,
  Study,
  StudyInfo,
} from 'store/graphql/variants/models';
import TabError from './TabError';
import { toExponentialNotation } from 'utils';
import { createQueryInCohortBuilder, DispatchStoryPage } from 'store/actionCreators/studyPage';
import { Sqon } from 'store/sqon';
import { RootState } from 'store/rootState';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToSqons } from 'common/sqonUtils';

import style from '../variantsSearchPage/VariantTable.module.scss';

type OwnProps = {
  variantId: string;
};

type FrequencyTabTableContainerState = {
  currentVirtualStudy: Sqon[];
};

const MIN_N_OF_PARTICIPANTS_FOR_LINK = 10;

const internalColumns = (
  studiesInfo: StudyInfo[],
  onLinkClick: (sqons: Sqon[]) => void,
  sqons: Sqon[],
) => [
  {
    title: 'Studies',
    dataIndex: 'study_id',
    // eslint-disable-next-line react/display-name
    render: (study_id: string) => {
      const study = studiesInfo.find((s) => s.id === study_id);
      return study?.code || study_id;
    },
  },
  {
    title: 'Domain',
    dataIndex: 'study_id',
    // eslint-disable-next-line react/display-name
    render: (study_id: string) => {
      const study = studiesInfo.find((s) => s.id === study_id);
      return study?.domain.join(', ') || '';
    },
  },
  {
    title: '# Participants',
    dataIndex: 'participant_number',
    // eslint-disable-next-line react/display-name
    render: (participant_number: string, row: any) =>
      parseInt(participant_number) >= MIN_N_OF_PARTICIPANTS_FOR_LINK ? (
        <Link
          to={'/explore'}
          href={'#top'}
          onClick={() => {
            const study = studiesInfo.find((s) => s.id === row.study_id);
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
          <Button type="link">
            <div className={style.variantTableLink}>{participant_number}</div>
          </Button>
        </Link>
      ) : (
        participant_number
      ),
  },
  {
    title: 'ALT Allele',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.ac,
    width: '14%',
  },
  {
    title: 'Alleles (ALT + REF)',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.an,
    width: '14%',
  },
  {
    title: 'Homozygote',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.homozygotes,
    width: '14%',
  },
  {
    title: 'Frequency',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => toExponentialNotation(frequencies?.upper_bound_kf?.af),
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

const makeRowFromFrequencies = (frequencies: Frequencies, locus: string) => {
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
    return <TabError />;
  }

  const { studies, frequencies, dataStudies, locus } = data;

  const internalFrequencies: FreqCombined | undefined = data?.frequencies?.internal?.upper_bound_kf;

  const hasParticipantLink: boolean = studies.some(
    (s: Study) => s.participant_number >= MIN_N_OF_PARTICIPANTS_FOR_LINK,
  );

  const allParticipants: string[] = [].concat(
    ...studies.map((s: Study) => s.participant_ids || []),
  );

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Card title="Kids First Studies">
            <Table
              dataSource={makeInternalCohortsRows(studies)}
              columns={internalColumns(
                dataStudies,
                props.onClickStudyLink,
                props.currentVirtualStudy,
              )}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>{''}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    {hasParticipantLink ? (
                      <Link
                        to={'/explore'}
                        href={'#top'}
                        onClick={() => {
                          props.onClickStudyLink(
                            addToSqons({
                              fieldsWValues: [{ field: 'kf_id', value: allParticipants }],
                              sqons: props.currentVirtualStudy,
                            }),
                          );
                          const toTop = document.getElementById('main-page-container');
                          toTop?.scrollTo(0, 0);
                        }}
                      >
                        <Button type="link">
                          <div className={style.variantTableLink}>{data?.participant_number}</div>
                        </Button>
                      </Link>
                    ) : (
                      data?.participant_number
                    )}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>{internalFrequencies?.ac}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>{internalFrequencies?.an}</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    {internalFrequencies?.homozygotes}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>
                    {toExponentialNotation(internalFrequencies?.af)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
              pagination={false}
            />
          </Card>
          <Card title="External Cohorts">
            <Table
              dataSource={makeRowFromFrequencies(frequencies, locus)}
              columns={externalColumns}
              pagination={false}
            />
          </Card>
        </Space>
      </StackLayout>
    </Spin>
  );
};

const Connected = connector(TabFrequencies);

export default Connected;
