/* eslint-disable react/display-name */
import React from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Avatar, Card, Space, Spin, Tag, Typography } from 'antd';
import capitalize from 'lodash/capitalize';

import ExpandableCell from 'components/ExpandableCell';
import ExpandableTable from 'components/ExpandableTable';
import { filterThanSortConsequencesByImpact } from 'components/Variants/consequences';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'components/Variants/Empty';
import ServerError from 'components/Variants/ServerError';
import { Consequence, Impact, VariantEntity } from 'store/graphql/variants/models';
import { useTabSummaryData } from 'store/graphql/variants/tabActions';

import Summary from './Summary';

import styles from './tables.module.scss';

const { Text } = Typography;

type OwnProps = {
  variantId: string;
};

type TableGroup = {
  consequences: Consequence[];
  omim: string;
  symbol: string;
  ensembleGeneId: string;
};

type SymbolToConsequences = {
  [key: string]: TableGroup;
};

export const shortToLongPrediction: Record<string, string> = {
  'sift.d': 'damaging',
  'sift.t': 'tolerated',
  'polyphen2.p': 'possibly damaging',
  'polyphen2.d': 'probably damaging',
  'polyphen2.b': 'benign',
  'fathmm.d': 'damaging',
  'fathmm.t': 'tolerated',
  'lrt.d': 'deleterious',
  'lrt.n': 'neutral',
  'lrt.u': 'unknown',
};

const getLongPredictionLabelIfKnown = (predictionField: string, predictionShortLabel: string) => {
  if (!predictionField || !predictionShortLabel) {
    return null;
  }
  const dictionaryPath = `${predictionField.toLowerCase()}.${predictionShortLabel.toLowerCase()}`;
  const longPrediction = shortToLongPrediction[dictionaryPath];
  return longPrediction || null;
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
    const ensembleGeneId = consequence.node.ensembl_gene_id || '';
    const oldConsequences = acc[symbol]?.consequences || [];

    return {
      ...acc,
      [symbol]: {
        consequences: [...oldConsequences, { ...consequence }],
        omim,
        symbol,
        ensembleGeneId,
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

const INDEX_IMPACT_PREDICTION_FIELD = 0;
const INDEX_IMPACT_PREDICTION_SHORT_LABEL = 1;
const INDEX_IMPACT_SCORE = 2;

const columns = [
  {
    title: 'AA',
    dataIndex: 'aa',
    render: (aa: string) => aa || DISPLAY_WHEN_EMPTY_DATUM,
    width: '10%',
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
    width: '25%',
  },
  {
    title: 'Coding Dna',
    dataIndex: 'codingDna',
    render: (codingDna: string) => codingDna || DISPLAY_WHEN_EMPTY_DATUM,
  },
  {
    title: 'Strand',
    dataIndex: 'strand',
    render(strand: number) {
      const isInDomain = [-1, 1].some((e) => e === strand);
      if (!isInDomain) {
        return DISPLAY_WHEN_EMPTY_DATUM;
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
      return <Tag className={`${loweredCaseVep}Impact`}>{capitalize(loweredCaseVep)}</Tag>;
    },
    width: 120,
  },

  {
    title: 'Impact',
    dataIndex: 'impact',
    render: (impacts: string[][]) => {
      if (impacts.length === 0) {
        return DISPLAY_WHEN_EMPTY_DATUM;
      }

      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={2}
          dataSource={impacts}
          renderItem={(item: any, id): React.ReactNode => {
            const predictionField = item[INDEX_IMPACT_PREDICTION_FIELD];
            const score = item[INDEX_IMPACT_SCORE];
            const predictionShortLabel = item[INDEX_IMPACT_PREDICTION_SHORT_LABEL];

            const predictionLongLabel = getLongPredictionLabelIfKnown(
              predictionField,
              predictionShortLabel,
            );

            const label = predictionLongLabel || predictionShortLabel;

            const description = label ? `${capitalize(label)} - ${score}` : score;
            return (
              <StackLayout key={id} horizontal className={styles.cellList}>
                <Text type={'secondary'}>{predictionField}:</Text>
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
    dataIndex: 'conservation',
    render: (conservation: number) =>
      conservation == null ? DISPLAY_WHEN_EMPTY_DATUM : conservation,
  },
  {
    title: 'Transcript',
    dataIndex: 'transcript',
    render: (transcript: { id: string; isCanonical?: boolean }) =>
      transcript.id ? (
        <Space size={'small'}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.ensembl.org/id/${transcript.id}`}
          >
            {transcript.id}
          </a>
          {transcript.isCanonical && (
            <Avatar className={styles.transcriptAvatar} size={16}>
              C
            </Avatar>
          )}
        </Space>
      ) : (
        DISPLAY_WHEN_EMPTY_DATUM
      ),
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
    conservation: consequence.node.conservations?.phylo_p17way_primate_rankscore,
    transcript: {
      id: consequence.node.ensembl_transcript_id,
      isCanonical: consequence.node.canonical,
    },
  }));

const TabSummary = ({ variantId }: OwnProps) => {
  const { loading, data: rawData, error } = useTabSummaryData(variantId);

  if (error) {
    return <ServerError />;
  }

  const data = rawData as VariantEntity | undefined;

  const consequences = (data?.consequences?.hits?.edges || []) as Consequence[];

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Summary variant={data} />
          <h3>Gene Consequences</h3>
          {makeTables(consequences).map((tableData: TableGroup, index: number) => {
            const symbol = tableData.symbol;
            const omim = tableData.omim;
            const orderedConsequences = tableData.consequences;

            return (
              <Card
                title={
                  <Space>
                    <span>Gene</span>
                    <span>{symbol}</span>
                    {omim && (
                      <>
                        <span>Omim</span>
                        <span>{omim}</span>
                      </>
                    )}
                  </Space>
                }
                key={index}
              >
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
