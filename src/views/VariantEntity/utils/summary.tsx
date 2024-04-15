import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import { NO_GENE, pickImpactBadge } from '@ferlab/ui/core/components/Consequences/Cell';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import CanonicalIcon from '@ferlab/ui/core/components/Icons/CanonicalIcon';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { IArrangerEdge } from '@ferlab/ui/core/graphql/types';
import { toExponentialNotation } from '@ferlab/ui/core/utils/numberUtils';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';
import { Button, Popover, Space, Tag, Tooltip, Typography } from 'antd';
import { INDEXES } from 'graphql/constants';
import { IClinVar, IGeneOmim, IVariantEntity } from 'graphql/variants/models';
import { isNumber } from 'lodash';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import { ClinvarColorMap } from 'views/Variants/components/PageContent/VariantsTable/utils';

import { STATIC_ROUTES } from 'utils/routes';
import { numberWithCommas } from 'utils/string';

import style from '../index.module.scss';

const { Text } = Typography;

const renderClinvar = (clinVar: IClinVar) => {
  const clinVarSigKey: string[] = [];

  clinVar?.clin_sig &&
    clinVar.clin_sig.map((c) => {
      clinVarSigKey.push(c.toLowerCase());
    });

  return clinVar?.clin_sig && clinVar.clinvar_id
    ? clinVarSigKey.map((clinvarKey, index) => (
        <Tag color={ClinvarColorMap[clinvarKey]} key={index}>
          <ExternalLink
            href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clinvar_id}`}
          >
            <Text className={style.clinVar}>
              {intl.get(`screen.variants.summary.clinVarLabel.${clinvarKey}`)}
            </Text>
          </ExternalLink>
        </Tag>
      ))
    : TABLE_EMPTY_PLACE_HOLDER;
};

const renderParticipantsFrequency = (variant: IVariantEntity) =>
  variant.internal_frequencies?.total?.pf &&
  isNumber(variant.internal_frequencies.total.pf) && (
    <Text className={style.frequency}>
      ({toExponentialNotation(variant.internal_frequencies.total.pf)})
    </Text>
  );

const renderParticipants = (variant: IVariantEntity) => {
  const totalNbOfParticipants = variant.internal_frequencies?.total?.pc || 0;
  const totalParticipants = variant.internal_frequencies?.total?.pn || 0;
  const studies = variant.studies;
  const participantIds =
    studies?.hits?.edges?.map((study) => study.node.participant_ids || [])?.flat() || [];

  if (!participantIds.length) {
    return (
      <div className={style.participants}>
        {totalNbOfParticipants} / {numberWithCommas(totalParticipants)}
        {renderParticipantsFrequency(variant)}
      </div>
    );
  }
  return (
    <div className={style.participants}>
      {participantIds.length > 10 ? (
        <>
          <Link
            to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
            onClick={() => {
              addQuery({
                queryBuilderId: DATA_EXPLORATION_QB_ID,
                query: generateQuery({
                  newFilters: [
                    generateValueFilter({
                      field: 'participant_id',
                      value: participantIds,
                      index: INDEXES.PARTICIPANT,
                    }),
                  ],
                }),
                setAsActive: true,
              });
            }}
          >
            {numberWithCommas(totalNbOfParticipants)}
          </Link>
          <Text> / {numberWithCommas(totalParticipants)}</Text>
        </>
      ) : (
        <Text>
          {numberWithCommas(totalNbOfParticipants)} / {numberWithCommas(totalParticipants)}
        </Text>
      )}
      {renderParticipantsFrequency(variant)}
    </div>
  );
};

const renderOmim = (pickedOmim: IArrangerEdge<IGeneOmim>[]) => {
  if (!pickedOmim.length) return [{ label: undefined, value: <>{TABLE_EMPTY_PLACE_HOLDER}</> }];

  return pickedOmim.map((omim) => ({
    label: undefined,
    value: (
      <Space size={4}>
        <ExternalLink href={`https://www.omim.org/entry/${omim.node.omim_id}`}>
          {omim.node.name}
        </ExternalLink>
        {omim.node.inheritance_code?.length > 0 &&
          omim.node.inheritance_code.map((code) => (
            <Tooltip key={code} title={intl.get(`screen.variants.table.inheritant.code.${code}`)}>
              <Tag>{code}</Tag>
            </Tooltip>
          ))}
      </Space>
    ),
  }));
};

export const getSummaryItems = (variant?: IVariantEntity) => {
  const geneWithPickedConsequence = variant?.genes?.hits?.edges?.find((e) =>
    (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
  )?.node;

  const consequences = geneWithPickedConsequence?.consequences?.hits?.edges;
  const pickedConsequence = consequences?.find((c) => c.node.picked);

  if (!geneWithPickedConsequence || !consequences || !pickedConsequence) return undefined;

  const pickedOmim = geneWithPickedConsequence.omim?.hits?.edges || [];

  return {
    banner: [
      {
        label: (
          <>
            {geneWithPickedConsequence.symbol === NO_GENE ? (
              <Text className={style.noGene}>{intl.get('entities.variant.no_gene')}</Text>
            ) : (
              <ExternalLink
                className={style.symbolLink}
                href={
                  geneWithPickedConsequence.omim_gene_id
                    ? `https://omim.org/entry/${geneWithPickedConsequence.omim_gene_id}`
                    : `https://www.omim.org/search?index=entry&start=1&limit=10&sort=score+desc%2C+prefix_sort+desc&search=${geneWithPickedConsequence.symbol}`
                }
              >
                <Text>{geneWithPickedConsequence.symbol}</Text>
              </ExternalLink>
            )}
            {pickedConsequence.node.ensembl_transcript_id && (
              <Text type="secondary">
                (
                <ExternalLink
                  className={style.ensemblLink}
                  href={`https://www.ensembl.org/id/${pickedConsequence.node.ensembl_transcript_id}`}
                >
                  {intl.get('screen.variants.summary.ensembl')}
                </ExternalLink>
                )
              </Text>
            )}
          </>
        ),
        value:
          geneWithPickedConsequence.symbol !== NO_GENE
            ? pickedConsequence.node.aa_change || TABLE_EMPTY_PLACE_HOLDER
            : '',
      },
      {
        label: intl.get('screen.variants.summary.consequence'),
        value: (
          <>
            {pickImpactBadge(pickedConsequence.node.vep_impact, 14, 14)}
            <Text className={style.summaryConsequence}>
              {removeUnderscoreAndCapitalize(pickedConsequence.node.consequence[0])}
            </Text>
          </>
        ),
      },
      {
        label: intl.get('screen.variants.summary.clinVar'),
        value: renderClinvar(variant.clinvar),
      },
      {
        label: (
          <>
            {intl.get('screen.variants.summary.participants')}
            <Tooltip
              arrowPointAtCenter
              placement="topLeft"
              title={intl.getHTML('screen.variants.summary.participantTooltip')}
            >
              <InfoCircleOutlined className={style.tooltipIcon} />
            </Tooltip>
          </>
        ),
        value: renderParticipants(variant),
      },
      {
        label: (
          <>
            {intl.get('screen.variants.summary.gnomAD')}
            <Tooltip
              arrowPointAtCenter
              placement="topLeft"
              title={intl.get('screen.variants.summary.gnomADTooltip')}
            >
              <InfoCircleOutlined className={style.tooltipIcon} />
            </Tooltip>
          </>
        ),
        value: variant.external_frequencies?.gnomad_genomes_3?.af ? (
          <ExternalLink
            className={style.gnomad}
            href={`https://gnomad.broadinstitute.org/variant/${variant.locus}?dataset=gnomad_r3`}
          >
            {toExponentialNotation(variant.external_frequencies.gnomad_genomes_3.af)}
          </ExternalLink>
        ) : (
          TABLE_EMPTY_PLACE_HOLDER
        ),
      },
    ],
    info: [
      <Space direction="horizontal">
        <ExternalLink
          href={`https://www.ensembl.org/id/${pickedConsequence.node.ensembl_transcript_id}`}
        >
          {pickedConsequence.node.ensembl_transcript_id}
        </ExternalLink>
        {pickedConsequence.node.canonical && (
          <Tooltip title={intl.get('screen.variants.summary.canonicalTooltip')}>
            <div>
              <CanonicalIcon className={style.canonicalIcon} height={16} width={16} />
            </div>
          </Tooltip>
        )}
      </Space>,
      pickedConsequence.node.refseq_mrna_id?.length > 0 &&
      //need to check first value not null because we have this type of data [null]
      pickedConsequence.node.refseq_mrna_id[0] ? (
        <>
          <ExternalLink
            href={`https://www.ncbi.nlm.nih.gov/nuccore/${pickedConsequence.node.refseq_mrna_id[0]}?report=graph`}
          >
            {pickedConsequence.node.refseq_mrna_id[0]}
          </ExternalLink>
          {pickedConsequence.node.refseq_mrna_id.length > 1 && (
            <Popover
              overlayClassName={style.popOverContent}
              placement="bottom"
              title={intl.get('screen.variants.summary.seeMorePopover.title', {
                ensemblTranscriptId: pickedConsequence.node.ensembl_transcript_id,
              })}
              content={
                <Space direction="vertical">
                  {pickedConsequence.node.refseq_mrna_id.map((id: string, index: number) => {
                    if (index === 0) return;
                    return (
                      <ExternalLink
                        href={`https://www.ncbi.nlm.nih.gov/nuccore/${id}?report=graph`}
                        key={index}
                      >
                        {id}
                      </ExternalLink>
                    );
                  })}
                </Space>
              }
            >
              <Button className={style.seeMore} type="link">
                {intl.get('screen.variants.summary.seeMore')}
              </Button>
            </Popover>
          )}
        </>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
      <Text>{pickedConsequence.node.coding_dna_change || TABLE_EMPTY_PLACE_HOLDER}</Text>,
      <>
        {variant.rsnumber ? (
          <ExternalLink href={`https://www.ncbi.nlm.nih.gov/snp/${variant.rsnumber}`}>
            {variant.rsnumber}
          </ExternalLink>
        ) : (
          TABLE_EMPTY_PLACE_HOLDER
        )}
      </>,
    ],
    details: {
      leftSection: {
        title: (
          <Text className={style.functionalScores}>
            {intl.get('screen.variants.summary.details.functionalScores')}
          </Text>
        ),
        items: [
          {
            label: intl.get('screen.variants.summary.details.sift'),
            value: pickedConsequence.node.predictions?.sift_pred ? (
              <>
                <Text className={style.predictionLabel}>
                  {intl.get(
                    `filters.options.consequences.predictions.sift_pred.${pickedConsequence.node.predictions.sift_pred}`,
                  )}
                </Text>
                ({pickedConsequence.node.predictions.sift_score})
              </>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            ),
          },
          {
            label: intl.get('screen.variants.summary.details.fathmm'),
            value: pickedConsequence.node.predictions?.fathmm_pred ? (
              <>
                <Text className={style.predictionLabel}>
                  {' '}
                  {intl.get(
                    `filters.options.consequences.predictions.fathmm_pred.${pickedConsequence.node.predictions.fathmm_pred}`,
                  )}
                </Text>
                ({pickedConsequence.node.predictions.fathmm_score})
              </>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            ),
          },
          {
            label: intl.get('screen.variants.summary.details.caddRaw'),
            value: pickedConsequence.node.predictions?.cadd_score || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.details.caddPhred'),
            value: pickedConsequence.node.predictions?.cadd_phred || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.details.dann'),
            value: pickedConsequence.node.predictions?.dann_score || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.details.lrt'),
            value: pickedConsequence.node.predictions?.lrt_pred ? (
              <>
                <Text className={style.predictionLabel}>
                  {intl.get(
                    `filters.options.consequences.predictions.lrt_pred.${pickedConsequence.node.predictions.lrt_pred}`,
                  )}
                </Text>
                ({pickedConsequence.node.predictions.lrt_score})
              </>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            ),
          },
          {
            label: intl.get('screen.variants.summary.details.revel'),
            value: pickedConsequence.node.predictions?.revel_score || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.details.polyphen2hvar'),
            value: pickedConsequence.node.predictions?.polyphen2_hvar_pred ? (
              <>
                <Text className={style.predictionLabel}>
                  {intl.get(
                    `filters.options.consequences.predictions.polyphen2_hvar_pred.${pickedConsequence.node.predictions.polyphen2_hvar_pred}`,
                  )}{' '}
                </Text>
                ({pickedConsequence.node.predictions.polyphen2_hvar_score})
              </>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            ),
          },
          {
            label: intl.get('screen.variants.summary.details.phyloP17Way'),
            value:
              pickedConsequence.node.conservations?.phyloP17way_primate || TABLE_EMPTY_PLACE_HOLDER,
          },
        ],
      },
      middleSection: [
        {
          title: intl.get('screen.variants.summary.details.geneConstraints'),
          items: [
            {
              label: intl.get('screen.variants.summary.details.pli'),
              value: geneWithPickedConsequence.gnomad?.pli || TABLE_EMPTY_PLACE_HOLDER,
            },
            {
              label: intl.get('screen.variants.summary.details.loeuf'),
              value: geneWithPickedConsequence.gnomad?.loeuf || TABLE_EMPTY_PLACE_HOLDER,
            },
          ],
        },
        {
          title: intl.get('screen.variants.summary.details.spliceAltering'),
          items: [
            {
              label: intl.get('screen.variants.summary.details.spliceAi'),
              value: geneWithPickedConsequence.spliceai?.ds ? (
                <>
                  <Text className={style.spliceAi}>{geneWithPickedConsequence.spliceai.ds}</Text>
                  {geneWithPickedConsequence.spliceai.type.map((t: string, index: number) => (
                    <Tooltip title={intl.get(`screen.variants.summary.details.spliceAiType.${t}`)}>
                      <Tag key={index}>{t}</Tag>
                    </Tooltip>
                  ))}
                </>
              ) : (
                TABLE_EMPTY_PLACE_HOLDER
              ),
            },
          ],
        },
      ],
      rightSection: {
        title: intl.get('screen.variants.summary.details.associatedConditions'),
        items: renderOmim(pickedOmim),
      },
    },
  };
};
