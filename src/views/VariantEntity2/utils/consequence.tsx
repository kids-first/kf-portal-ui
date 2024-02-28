import intl from 'react-intl-universal';
import { CheckCircleFilled } from '@ant-design/icons';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import {
  IConsequenceEntity,
  IConservationsEntity,
  IGeneEntity,
  IPredictionEntity,
  IVariantEntity,
} from 'graphql/variants/models';
import { Space, Table, Tag, Tooltip, Typography } from 'antd';

import style from '../index.module.scss';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';
import { pickImpactBadge } from '@ferlab/ui/core/components/Consequences/Cell';
import { getEntityConsequenceDictionary } from 'utils/translation';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import {
  INDEX_IMPACT_PREDICTION_FIELD,
  INDEX_IMPACT_PREDICTION_SHORT_LABEL,
  INDEX_IMPACT_SCORE,
  getLongPredictionLabelIfKnown,
} from '@ferlab/ui/core/pages/EntityPage/utils/consequences';
import { capitalize } from 'lodash';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { ReactNode } from 'react';
import CanonicalIcon from '@ferlab/ui/core/components/Icons/CanonicalIcon';
import { ColumnType } from 'antd/lib/table';

const { Text } = Typography;

export const getColumn = (geneSymbolOfPicked?: string): ProColumnType[] => [
  {
    key: 'symbol',
    title: intl.get('screen.variants.consequences.gene'),
    render: (gene: IGeneEntity) =>
      gene.symbol ? (
        <>
          <ExternalLink href={`https://www.omim.org/entry/${gene.omim_gene_id}`}>
            {gene.symbol}
          </ExternalLink>
          {gene.symbol === geneSymbolOfPicked && (
            <Tooltip title={intl.get('screen.variants.consequences.pickedTooltip')}>
              <CheckCircleFilled className={style.pickedIcon} />
            </Tooltip>
          )}
        </>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'biotype',
    dataIndex: 'biotype',
    title: intl.get('screen.variants.consequences.geneType'),
    render: (biotype: string) =>
      biotype ? removeUnderscoreAndCapitalize(biotype) : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'pli',
    dataIndex: 'gnomad',
    title: intl.get('screen.variants.consequences.gnomad.pli'),
    render: (gnomad: { pli: number }) => gnomad?.pli || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'loeuf',
    dataIndex: 'gnomad',
    title: intl.get('screen.variants.consequences.gnomad.loeuf'),
    render: (gnomad: { loeuf: string }) => gnomad?.loeuf || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'spliceai',
    dataIndex: 'spliceai',
    title: intl.get('screen.variants.consequences.spliceAi'),
    render: (spliceai: { ds: number; type: string[] }) =>
      spliceai?.ds ? (
        <>
          <span className={style.spliceAi}>{spliceai.ds}</span>
          {spliceai.type.map((t: string, index: number) => {
            return (
              <Tooltip title={intl.get(`screen.variants.summary.details.spliceAiType.${t}`)}>
                <Tag key={index}>{t}</Tag>
              </Tooltip>
            );
          })}
        </>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
];

export const getPredictionScore = (
  predictions: IPredictionEntity,
  dictionary: {
    sift: string;
    polyphen2: string;
    fathmm: string;
    cadd: string;
    dann: string;
    lrt: string;
    revel: string;
  },
): any[][] =>
  [
    [dictionary.sift, predictions?.sift_pred, predictions?.sift_score],
    [dictionary.polyphen2, predictions?.polyphen2_hvar_pred, predictions?.sift_score],
    [dictionary.fathmm, predictions?.fathmm_score],
    [dictionary.cadd, null, predictions?.cadd_score],
    [dictionary.dann, null, predictions?.dann_score],
    [dictionary.lrt, predictions?.lrt_pred, predictions?.lrt_score],
    [dictionary.revel, null, predictions?.revel_score],
  ].filter(([, , score]) => score);

export const getExpandedColumns = (): ColumnType<any>[] => [
  {
    key: 'aa_change',
    dataIndex: 'aa_change',
    title: (
      <Tooltip title={intl.get('screen.variants.consequences.aaColumnTooltip')}>
        {intl.get('screen.variants.consequences.aaColumn')}
      </Tooltip>
    ),
    render: (aa_change: string) => aa_change || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'consequence',
    title: intl.get('screen.variants.consequences.consequence'),
    render: (consequence: IConsequenceEntity) => {
      if (!consequence.consequence?.length) return TABLE_EMPTY_PLACE_HOLDER;
      return (
        <>
          {pickImpactBadge(consequence.vep_impact)}
          <span className={style.consequence}>
            {removeUnderscoreAndCapitalize(consequence.consequence[0])}
          </span>
        </>
      );
    },
  },
  {
    key: 'coding_dna_change',
    dataIndex: 'coding_dna_change',
    title: intl.get('screen.variants.consequences.cdnaChangeColumn'),
    render: (coding_dna_change: string) => coding_dna_change || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'predictions',
    dataIndex: 'predictions',
    title: intl.get('screen.variants.consequences.predictions.prediction'),
    render: (predictions: IPredictionEntity) => {
      const impact = getPredictionScore(predictions, getEntityConsequenceDictionary().predictions);
      if (!impact?.length) return TABLE_EMPTY_PLACE_HOLDER;
      return (
        <ExpandableCell
          dataSource={impact}
          dictionnary={{
            'see.less': intl.get('see.less'),
            'see.more': intl.get('see.more'),
          }}
          nOfElementsWhenCollapsed={2}
          renderItem={(item: any, id) => {
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
              <StackLayout horizontal key={id}>
                <Text className={style.predictionLabel}>{predictionField}:</Text>
                <Text>{description}</Text>
              </StackLayout>
            );
          }}
        />
      );
    },
  },
  {
    key: 'conservations',
    dataIndex: 'conservations',
    title: intl.get('screen.variants.consequences.conservation'),
    render: (conservations: IConservationsEntity) =>
      conservations?.phyloP17way_primate ? (
        <StackLayout horizontal>
          <Text className={style.conservationLabel}>
            {intl.get('screen.variants.consequences.phyloP17Way')}:
          </Text>
          <Text>{conservations.phyloP17way_primate}</Text>
        </StackLayout>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'ensembl_transcript_id',
    title: intl.get('screen.variants.consequences.transcript'),
    render: (consequence: IConsequenceEntity) => {
      const { ensembl_transcript_id, canonical } = consequence;
      return (
        <Space>
          <ExternalLink href={`https://www.ensembl.org/id/${ensembl_transcript_id}`}>
            {ensembl_transcript_id}
          </ExternalLink>
          {canonical && (
            <Tooltip title={intl.get('screen.variants.consequences.canonical')}>
              <div>
                <CanonicalIcon className={style.canonicalIcon} height={14} width={14} />
              </div>
            </Tooltip>
          )}
        </Space>
      );
    },
  },
  {
    title: intl.get('screen.variants.consequences.refSeq'),
    dataIndex: 'refseq_mrna_id',
    key: 'consequences',
    render: (refseq_mrna_id: string) =>
      refseq_mrna_id ? (
        <ExternalLink href={`https://www.ncbi.nlm.nih.gov/nuccore/${refseq_mrna_id}?report=graph`}>
          {refseq_mrna_id}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
];

export const expandedRowRender = (row: IGeneEntity): ReactNode => {
  return (
    <Table
      className={style.expandedTable}
      columns={getExpandedColumns()}
      dataSource={hydrateResults(row.consequences?.hits?.edges || [])}
      pagination={false}
      bordered
    />
  );
};
