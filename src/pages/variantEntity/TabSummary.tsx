/* eslint-disable react/display-name */
import React from 'react';
import { useTabSummaryData } from 'store/graphql/variants/tabActions';
import { List, Space, Spin, Table } from 'antd';
import Summary from './Summary';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Consequence, VariantEntity } from 'store/graphql/variants/models';
import TabError from './TabError';

type OwnProps = {
  variantId: string;
};

type TableGroup = {
  consequences: Consequence[];
  omim: string;
  biotype: string;
  symbol: string;
};

type SymbolToConsequences = {
  [key: string]: TableGroup;
};

const groupConsequencesBySymbol = (consequences: Consequence[]) => {
  if (consequences.length === 0) {
    return {};
  }
  return consequences.reduce((acc: SymbolToConsequences, consequence: Consequence) => {
    const symbol = consequence.node.symbol;
    if (!symbol) {
      return acc;
    }
    const omim = consequence.node.omim_gene_id || '';
    const biotype = consequence.node.biotype || '';
    const oldConsequences = acc[symbol]?.consequences || [];

    return {
      ...acc,
      [symbol]: {
        consequences: [...oldConsequences, { ...consequence }],
        omim,
        biotype,
        symbol,
      },
    };
  }, {});
};

const orderGenes = (mSymbolToConsequences: SymbolToConsequences) => {
  if (!mSymbolToConsequences || Object.keys(mSymbolToConsequences).length === 0) {
    return [];
  }
  return Object.entries(mSymbolToConsequences).map(([, values]) => ({ ...values }));
};

const orderConsequences = (consequences: Consequence[]) => [...consequences];

const orderConsequencesForTable = (tableGroups: TableGroup[]) => {
  if (!tableGroups || tableGroups.length === 0) {
    return [];
  }

  return tableGroups.map((tableGroup: TableGroup) => {
    const consequences = tableGroup.consequences;
    return {
      ...tableGroup,
      consequences: orderConsequences(consequences),
    };
  });
};

const makeTables = (rawConsequences: Consequence[]) => {
  if (!rawConsequences || rawConsequences.length === 0) {
    return [];
  }
  const symbolToConsequences = groupConsequencesBySymbol(rawConsequences);
  const orderedGenes = orderGenes(symbolToConsequences);
  return orderConsequencesForTable(orderedGenes);
};

const columns = [
  {
    title: 'AA',
    dataIndex: 'aa',
  },
  {
    title: 'Consequence',
    dataIndex: 'consequences',
    render: (consequences: string[]) => (
      <List
        size="small"
        dataSource={consequences}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    ),
  },
  {
    title: 'Coding Dna',
    dataIndex: 'codingDna',
  },
  {
    title: 'Strand',
    dataIndex: 'strand',
  },
  {
    title: 'VEP',
    dataIndex: 'vep',
  },

  {
    title: 'Impact',
    dataIndex: 'impact',
    render: (impacts: [string[]]) => (
      <List
        size="small"
        dataSource={impacts}
        renderItem={(items: string[]) => <List.Item>{items?.toString()}</List.Item>}
      />
    ),
  },
  {
    title: 'Conservations',
    dataIndex: 'conservations',
  },
  {
    title: 'Transcript',
    dataIndex: 'transcript',
  },
];

const makeRows = (consequences: Consequence[]) =>
  consequences.map((consequence: Consequence, index: number) => ({
    key: `${index + 1}`,
    aa: consequence.node.aa_change,
    consequences: consequence.node.consequences.filter((c) => c || c.length > 0),
    codingDna: consequence.node.coding_dna_change,
    strand: consequence.node.strand,
    vep: consequence.node.vep_impact,
    impact: [
      [
        'sift',
        consequence.node.predictions?.sift_pred,
        consequence.node.predictions?.sift_converted_rankscore,
      ],
      [
        'polyphen2',
        consequence.node.predictions?.polyphen2_hvar_pred,
        consequence.node.predictions?.sift_converted_rankscore,
      ],
      [
        'fathmm',
        consequence.node.predictions?.fathmm_pred,
        consequence.node.predictions?.fathmm_converted_rankscore,
      ],
      ['cadd', consequence.node.predictions?.cadd_rankscore],
      ['dann', consequence.node.predictions?.dann_rankscore],
      [
        'lrt',
        consequence.node.predictions?.lrt_pred,
        consequence.node.predictions?.lrt_converted_rankscore,
      ],
      ['revel', consequence.node.predictions?.revel_rankscore],
    ],
    conservations: consequence.node.conservations?.phylo_p17way_primate_rankscore,
    transcript: consequence.node.ensembl_transcript_id,
  }));

const TabSummary = ({ variantId }: OwnProps) => {
  const { loading, data: rawData, error } = useTabSummaryData(variantId);

  if (error) {
    return <TabError />;
  }

  const data = rawData as VariantEntity | undefined;

  const consequences = (data?.consequences?.hits?.edges || []) as Consequence[];

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Summary variant={data} />
          {makeTables(consequences).map((tableData: TableGroup, index: number) => {
            const symbol = tableData.symbol;
            const omim = tableData.omim;
            const biotype = tableData.biotype;
            const orderedConsequences = tableData.consequences;
            return (
              <Table
                key={index}
                title={() => [symbol, omim, biotype].join(' ')}
                dataSource={makeRows(orderedConsequences)}
                columns={columns}
              />
            );
          })}
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabSummary;
