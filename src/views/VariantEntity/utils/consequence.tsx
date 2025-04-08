import { ReactNode } from 'react';
import intl from 'react-intl-universal';
import { CheckCircleFilled } from '@ant-design/icons';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import { pickImpactBadge } from '@ferlab/ui/core/components/Consequences/Cell';
import {
  renderTemporaryAAChange,
  renderTemporaryCodingDnaChange,
} from '@ferlab/ui/core/components/Consequences/utils';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import CanonicalIcon from '@ferlab/ui/core/components/Icons/CanonicalIcon';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { IVariantEntity as FerlabIVariantEntity } from '@ferlab/ui/core/pages/EntityPage/type';
import {
  getLongPredictionLabelIfKnown,
  INDEX_IMPACT_PREDICTION_FIELD,
  INDEX_IMPACT_PREDICTION_SHORT_LABEL,
  INDEX_IMPACT_SCORE,
} from '@ferlab/ui/core/pages/EntityPage/utils/consequences';
import { toExponentialNotation } from '@ferlab/ui/core/utils/numberUtils';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';
import { Space, Table, Tag, Tooltip, Typography } from 'antd';
import { ColumnType } from 'antd/lib/table';
import {
  IConsequenceEntity,
  IConservationsEntity,
  IGeneEntity,
  IPredictionEntity,
  IVariantEntity,
} from 'graphql/variants/models';
import { capitalize } from 'lodash';

import { getEntityConsequenceDictionary } from 'utils/translation';

import style from '../index.module.css';

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
    render: (gnomad: { pli: number }) =>
      gnomad?.pli ? toExponentialNotation(gnomad.pli) : TABLE_EMPTY_PLACE_HOLDER,
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
    render: (spliceAi: { ds: number; type: string[] }) =>
      spliceAi?.ds ? (
        <>
          <span className={style.spliceAi}>{spliceAi.ds}</span>
          {spliceAi.type.map((t: string, index: number) => (
            <Tooltip title={intl.get(`screen.variants.summary.details.spliceAiType.${t}`)}>
              <Tag key={index}>{t}</Tag>
            </Tooltip>
          ))}
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
    fathmm: string;
    caddRaw: string;
    caddPhred: string;
    dann: string;
    lrt: string;
    revel: string;
    polyphen2: string;
  },
): (string | number | null)[][] =>
  [
    [dictionary.sift, predictions?.sift_pred, predictions?.sift_score],
    [dictionary.fathmm, predictions?.fathmm_pred, predictions?.fathmm_score],
    [dictionary.caddRaw, null, predictions?.cadd_score],
    [dictionary.caddPhred, null, predictions?.cadd_phred],
    [dictionary.dann, null, predictions?.dann_score],
    [dictionary.lrt, predictions?.lrt_pred, predictions?.lrt_score],
    [dictionary.revel, null, predictions?.revel_score],
    [dictionary.polyphen2, predictions?.polyphen2_hvar_pred, predictions?.polyphen2_hvar_score],
  ].filter(([, , score]) => score || score === 0);

export const getExpandedColumns = (variant: IVariantEntity): ColumnType<any>[] => [
  {
    key: 'aa_change',
    dataIndex: 'hgvsp',
    title: (
      <Tooltip title={intl.get('screen.variants.consequences.aaColumnTooltip')}>
        <Text className={style.tooltip}>{intl.get('screen.variants.consequences.aaColumn')}</Text>
      </Tooltip>
    ),
    render: (hgvsp: string) => renderTemporaryAAChange(hgvsp),
  },
  // FIXME: SKFP-1104 Temporary disabled, restore when aa_change is stable
  // {
  //   key: 'aa_change',
  //   dataIndex: 'aa_change',
  //   title: (
  //     <Tooltip title={intl.get('screen.variants.consequences.aaColumnTooltip')}>
  //       <Text className={style.tooltip}>{intl.get('screen.variants.consequences.aaColumn')}</Text>
  //     </Tooltip>
  //   ),
  //   render: (aa_change: string) => aa_change || TABLE_EMPTY_PLACE_HOLDER,
  // },
  {
    key: 'consequence',
    title: intl.get('screen.variants.consequences.consequence'),
    render: (consequence: IConsequenceEntity) => {
      if (!consequence.consequence?.length) return TABLE_EMPTY_PLACE_HOLDER;
      return (
        <>
          <Tooltip
            title={intl.get(`screen.variants.consequences.impactTooltip.${consequence.vep_impact}`)}
          >
            <Text>{pickImpactBadge(consequence.vep_impact)}</Text>
          </Tooltip>
          <Text className={style.consequence}>
            {removeUnderscoreAndCapitalize(consequence.consequence[0])}
          </Text>
          <Tooltip title={intl.get('screen.variants.consequences.pickedConsequenceTooltip')}>
            {consequence.picked && <CheckCircleFilled className={style.pickedIcon} />}
          </Tooltip>
        </>
      );
    },
  },
  // FIXME: SKFP-1104 Temporary disabled, restore when coding_dna_change is stable
  // {
  //   key: 'coding_dna_change',
  //   dataIndex: 'coding_dna_change',
  //   title: intl.get('screen.variants.consequences.cdnaChangeColumn'),
  //   render: (coding_dna_change: string) => coding_dna_change || TABLE_EMPTY_PLACE_HOLDER,
  // },
  {
    key: 'coding_dna_change',
    title: intl.get('screen.variants.consequences.cdnaChangeColumn'),
    render: (consequence: IConsequenceEntity) =>
      renderTemporaryCodingDnaChange(consequence, variant as unknown as FerlabIVariantEntity),
  },
  {
    key: 'predictions',
    dataIndex: 'predictions',
    title: intl.get('screen.variants.consequences.predictions.predictions'),
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
            const description = label ? `${capitalize(label)} (${score})` : score;

            return (
              <StackLayout horizontal key={id}>
                <Text className={style.predictionLabel}>
                  {intl.get(
                    `screen.variants.summary.details.${
                      predictionField[0].toLowerCase() + predictionField.slice(1)
                    }`,
                  )}
                  :
                </Text>
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
    title: intl.get('screen.variants.consequences.transcripts'),
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
    render: (refseq_mrna_id: string[]) => {
      if (!refseq_mrna_id?.length) return TABLE_EMPTY_PLACE_HOLDER;

      return (
        <ExpandableCell
          dataSource={refseq_mrna_id}
          dictionnary={{
            'see.less': intl.get('see.less'),
            'see.more': intl.get('see.more'),
          }}
          nOfElementsWhenCollapsed={1}
          renderItem={(item: string, id) => (
            <StackLayout horizontal key={id}>
              <ExternalLink href={`https://www.ncbi.nlm.nih.gov/nuccore/${item}?report=graph`}>
                {item}
              </ExternalLink>
            </StackLayout>
          )}
        />
      );
    },
  },
];

export const expandedRowRender = (
  row: IGeneEntity,
  variant: IVariantEntity | undefined,
): ReactNode => (
  <Table
    className={style.expandedTable}
    columns={getExpandedColumns(variant!)}
    dataSource={hydrateResults(row.consequences?.hits?.edges || [])}
    pagination={false}
    bordered
  />
);
