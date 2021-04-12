import React from 'react';
import { Button, Card, Space, Spin, Table } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import {
  useTabFrequenciesData,
  useTabFrequenciesStudiesData,
} from 'store/graphql/variants/tabActions';
import {
  FreqCombined,
  FreqInternal,
  Frequencies,
  StudyInfo,
  StudyNode,
} from 'store/graphql/variants/models';
import TabError from './TabError';
import { toExponentialNotation } from 'utils';
import { Link } from 'react-router-dom';
import style from '../variantsSearchPage/VariantTable.module.scss';
import { createQueryInCohortBuilder, DispatchStoryPage } from 'store/actionCreators/studyPage';
import { Sqon } from 'store/sqon';
import { RootState } from 'store/rootState';
import { connect, ConnectedProps } from 'react-redux';
import { addToSqons } from 'common/sqonUtils';

type OwnProps = {
  variantId: string;
};

type FrequencyTabTableContainerState = {
  currentVirtualStudy: Sqon[];
};

const internalColumns = (
  studiesInfo: StudyInfo[],
  participants: string[],
  onLinkClick: (sqons: Sqon[]) => void,
  sqons: Sqon[],
) => [
  {
    title: 'Studies',
    dataIndex: 'study_id',
    // eslint-disable-next-line react/display-name
    render: (study_id: string) => {
      const study = studiesInfo.find((s) => s.id === study_id);
      return study ? <div>{study.code}</div> : <div>{study_id}</div>;
    },
  },
  {
    title: 'Domain',
    dataIndex: 'study_id',
    // eslint-disable-next-line react/display-name
    render: (study_id: string) => {
      const study = studiesInfo.find((s) => s.id === study_id);
      return study ? <div>{study.domain.join(', ')}</div> : <div>-</div>;
    },
  },
  {
    title: '# Participants',
    dataIndex: 'participant_number',
    // eslint-disable-next-line react/display-name
    render: (participant_number: string, row: any) =>
      parseInt(participant_number) > 10 ? (
        <Link
          to={'/explore'}
          href={'#top'}
          onClick={() => {
            const study = studiesInfo.find((s) => s.id === row.study_id);
            if (study) {
              onLinkClick(
                addToSqons({
                  fieldsWValues: [
                    { field: 'kf_id', value: participants },
                    { field: 'study.code', value: study.code },
                  ],
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
  },
  {
    title: 'Alleles (ALT + REF)',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.an,
  },
  {
    title: 'Homozygote',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.homozygotes,
  },
  {
    title: 'Frequency',
    dataIndex: 'frequencies',
    render: (frequencies: FreqInternal) => toExponentialNotation(frequencies?.upper_bound_kf?.af),
  },
];

const externalColumns = [
  {
    title: 'Cohort',
    dataIndex: 'cohortName',
  },
  {
    title: 'ALT Allele',
    dataIndex: 'alt',
  },
  {
    title: 'Alleles (ALT + REF)',
    dataIndex: 'altRef',
  },
  {
    title: 'Homozygote',
    dataIndex: 'homozygotes',
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
  },
];

const makeRowFromFrequencies = (frequencies: Frequencies) => {
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
      cohortName: 'TopMed',
      alt: topmed.ac,
      altRef: topmed.an,
      homozygotes: topmed.homozygotes,
      frequency: toExponentialNotation(topmed.af),
      key: '1',
    },
    {
      cohortName: 'Gnomad Genomes (v3)',
      alt: gnomadGenomes3.ac,
      altRef: gnomadGenomes3.an,
      homozygotes: gnomadGenomes3.homozygotes,
      frequency: toExponentialNotation(gnomadGenomes3.af),
      key: '2',
    },
    {
      cohortName: 'Gnomad Genomes (v2.1)',
      alt: gnomadGenomes2_1.ac,
      altRef: gnomadGenomes2_1.an,
      homozygotes: gnomadGenomes2_1.homozygotes,
      frequency: toExponentialNotation(gnomadGenomes2_1.af),
      key: '3',
    },
    {
      cohortName: 'Gnomad Exomes (v2.1)',
      alt: gnomadExomes2_1.ac,
      altRef: gnomadExomes2_1.an,
      homozygotes: gnomadExomes2_1.homozygotes,
      frequency: toExponentialNotation(gnomadExomes2_1.af),
      key: '4',
    },
    {
      cohortName: '1000 Genomes',
      alt: oneThousandsGenomes.ac,
      altRef: oneThousandsGenomes.an,
      homozygotes: oneThousandsGenomes.homozygotes,
      frequency: toExponentialNotation(oneThousandsGenomes.af),
      key: '5',
    },
  ];
};

const makeInternalCohortsRows = (rows: StudyNode[]) =>
  rows.map((row: StudyNode, index: number) => ({ ...row.node, key: `${index}` }));

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

  const studyIdList = data.studies.map((s: { node: { study_id: any } }) => s.node.study_id);
  const { loadingStudies, dataStudies, errorStudies } = useTabFrequenciesStudiesData(studyIdList);

  if (error || errorStudies) {
    return <TabError />;
  }

  const { studies, frequencies, participant_ids } = data;

  const internalFrequencies: FreqCombined | undefined = data?.frequencies?.internal?.upper_bound_kf;

  return (
    <Spin spinning={loading || loadingStudies}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Card title="Kids First Studies">
            <Table
              dataSource={makeInternalCohortsRows(studies)}
              columns={internalColumns(
                dataStudies || [],
                participant_ids,
                props.onClickStudyLink,
                props.currentVirtualStudy,
              )}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>{''}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <Link
                      to={'/explore'}
                      href={'#top'}
                      onClick={() => {
                        props.onClickStudyLink(
                          addToSqons({
                            fieldsWValues: [{ field: 'kf_id', value: participant_ids }],
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
              dataSource={makeRowFromFrequencies(frequencies)}
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
