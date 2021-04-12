/* eslint-disable react/display-name */
import React from 'react';
import { useTabSummaryData } from 'store/graphql/variants/tabActions';
import { Card, Space, Spin, Tag, Typography } from 'antd';
import Summary from './Summary';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Consequence, Impact, VariantEntity } from 'store/graphql/variants/models';
import TabError from './TabError';
import ExpandableCell from 'components/ExpandableCell';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import capitalize from 'lodash/capitalize';
import style from 'style/themes/default/_colors.scss';
import ExpandableTable from 'components/ExpandableTable';

import styles from './tables.module.scss';
import { filterThanSortConsequencesByImpact } from 'components/Variants/consequences';

const { Text } = Typography;

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

const orderConsequencesForTable = (tableGroups: TableGroup[]) => {
  if (!tableGroups || tableGroups.length === 0) {
    return [];
  }

  return tableGroups.map((tableGroup: TableGroup) => {
    const consequences = tableGroup.consequences;
    return {
      ...tableGroup,
      consequences: filterThanSortConsequencesByImpact(consequences),
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

const INDEX_IMPACT_TITLE = 0;
const INDEX_IMPACT_LABEL = 1;
const INDEX_IMPACT_SCORE = 2;

const columns = [
  {
    title: 'AA',
    dataIndex: 'aa',
  },
  {
    title: 'Consequence',
    dataIndex: 'consequences',
    render: (consequences: string[]) => {
      if (consequences.length === 0) {
        return <></>;
      }
      return (
        <ExpandableCell
          dataSource={consequences}
          renderItem={(item: any, id): React.ReactNode => (
            <StackLayout key={id} horizontal className={styles.cellList}>
              <Text>{item}</Text>
            </StackLayout>
          )}
        />
      );
    },
  },
  {
    title: 'Coding Dna',
    dataIndex: 'codingDna',
  },
  {
    title: 'Strand',
    dataIndex: 'strand',
    render(strand: number) {
      const isInDomain = [-1, 1].some((e) => e === strand);
      if (!isInDomain) {
        return <></>;
      }
      return strand > 0 ? <PlusOutlined /> : <MinusOutlined />;
    },
    width: 60,
  },
  {
    title: 'VEP',
    dataIndex: 'vep',
    render: (vep: Impact) => {
      const loweredCaseVep = vep.toLowerCase();
      return <Tag color={style[`${loweredCaseVep}Impact`]}>{capitalize(loweredCaseVep)}</Tag>;
    },
    width: 120,
  },

  {
    title: 'Impact',
    dataIndex: 'impact',
    render: (impacts: string[][]) => {
      if (impacts.length === 0) {
        return <></>;
      }

      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={2}
          dataSource={impacts}
          renderItem={(item: any, id): React.ReactNode => {
            const title = item[INDEX_IMPACT_TITLE];
            const label = item[INDEX_IMPACT_LABEL];
            const score = item[INDEX_IMPACT_SCORE];
            const description = label ? `${label} - ${score}` : score;
            return (
              <StackLayout key={id} horizontal className={styles.cellList}>
                <Text type={'secondary'}>{title}:</Text>
                <Text>{description}</Text>
              </StackLayout>
            );
          }}
        />
      );
    },
    width: 270,
  },
  {
    title: 'Conservation',
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
        'Sift',
        consequence.node.predictions?.sift_pred,
        consequence.node.predictions?.sift_converted_rankscore,
      ],
      [
        'Polyphen2',
        consequence.node.predictions?.polyphen2_hvar_pred,
        consequence.node.predictions?.sift_converted_rankscore,
      ],
      [
        'Fathmm',
        consequence.node.predictions?.fathmm_pred,
        consequence.node.predictions?.fathmm_converted_rankscore,
      ],
      ['Cadd', null, consequence.node.predictions?.cadd_rankscore],
      ['Dann', null, consequence.node.predictions?.dann_rankscore],
      [
        'Lrt',
        consequence.node.predictions?.lrt_pred,
        consequence.node.predictions?.lrt_converted_rankscore,
      ],
      ['Revel', null, consequence.node.predictions?.revel_rankscore],
    ].filter(([, , score]) => score),
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
              <Card title={[symbol, omim, biotype].join(' ')} key={index}>
                <ExpandableTable
                  nOfElementsWhenCollapsed={1}
                  buttonText={(showAll, hiddenNum) =>
                    showAll ? 'Hide Transcripts' : `Show Transcripts (${hiddenNum})`
                  }
                  key={index}
                  dataSource={makeRows(orderedConsequences)}
                  columns={columns}
                  pagination={false}
                />
              </Card>
            );
          })}
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabSummary;
