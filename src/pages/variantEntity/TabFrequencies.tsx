import React from 'react';
import { Space, Table, Spin } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabFrequenciesData } from 'store/graphql/variants/tabActions';
import { enhanceNodeWithIndexKey } from 'store/graphql/utils/query';
import { FreqCombined, FreqInternal, Frequencies } from 'store/graphql/variants/models';
import TabError from './TabError';

type OwnProps = {
  variantId: string;
};

const internalColumns = [
  {
    title: 'Studies',
    dataIndex: 'study_id',
  },
  {
    title: '# Participants',
    dataIndex: 'participant_number',
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
    render: (frequencies: FreqInternal) => frequencies?.upper_bound_kf?.af,
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
      frequency: topmed.af,
      key: '1',
    },
    {
      cohortName: 'Gnomad Genomes (v3)',
      alt: gnomadGenomes3.ac,
      altRef: gnomadGenomes3.an,
      homozygotes: gnomadGenomes3.homozygotes,
      frequency: gnomadGenomes3.af,
      key: '2',
    },
    {
      cohortName: 'Gnomad Genomes (v2.1)',
      alt: gnomadGenomes2_1.ac,
      altRef: gnomadGenomes2_1.an,
      homozygotes: gnomadGenomes2_1.homozygotes,
      frequency: gnomadGenomes2_1.af,
      key: '3',
    },
    {
      cohortName: 'Gnomad Exomes (v2.1)',
      alt: gnomadExomes2_1.ac,
      altRef: gnomadExomes2_1.an,
      homozygotes: gnomadExomes2_1.homozygotes,
      frequency: gnomadExomes2_1.af,
      key: '4',
    },
    {
      cohortName: '1000 Genomes',
      alt: oneThousandsGenomes.ac,
      altRef: oneThousandsGenomes.an,
      homozygotes: oneThousandsGenomes.homozygotes,
      frequency: oneThousandsGenomes.af,
      key: '5',
    },
  ];
};

const TabFrequencies = ({ variantId }: OwnProps) => {
  const { loading, data, error } = useTabFrequenciesData(variantId);

  if (error) {
    return <TabError />;
  }

  const { studies, frequencies } = data;

  const internalFrequencies: FreqCombined | undefined = data?.frequencies?.internal?.upper_bound_kf;

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Table
            title={() => 'Internal Cohorts'}
            dataSource={enhanceNodeWithIndexKey(studies)}
            columns={internalColumns}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{data?.participant_number}</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{internalFrequencies?.ac}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{internalFrequencies?.an}</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {internalFrequencies?.homozygotes}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{internalFrequencies?.af}</Table.Summary.Cell>
              </Table.Summary.Row>
            )}
            pagination={false}
          />
          <Table
            title={() => 'External Cohorts'}
            dataSource={makeRowFromFrequencies(frequencies)}
            columns={externalColumns}
            pagination={false}
          />
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabFrequencies;
