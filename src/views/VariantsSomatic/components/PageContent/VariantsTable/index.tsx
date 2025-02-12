import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FireFilled, FireOutlined } from '@ant-design/icons';
import ConsequencesCell from '@ferlab/ui/core/components/Consequences/Cell';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import FixedSizeTable from '@ferlab/ui/core/components/FixedSizeTable';
import GeneCell from '@ferlab/ui/core/components/Gene/Cell';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { useFilters } from '@ferlab/ui/core/data/filters/utils';
import { ISqonGroupFilter, ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import {
  IArrangerResultsTree,
  IQueryConfig,
  IQueryResults,
  TQueryConfigCb,
} from '@ferlab/ui/core/graphql/types';
import { numberWithCommas, toExponentialNotation } from '@ferlab/ui/core/utils/numberUtils';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Space, Tag, Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { hydrateResults } from 'graphql/models';
import {
  IClinVar,
  IExternalFrequenciesEntity,
  IGeneEntity,
  ITableVariantSomaticEntity,
  IVariantInternalFrequencies,
  IVariantSomaticEntity,
  IVariantStudyEntity,
} from 'graphql/variants/models';
import { capitalize } from 'lodash';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown';
import { DATA_EXPLORATION_QB_ID, DEFAULT_PAGE_INDEX } from 'views/DataExploration/utils/constant';
import {
  GnomadCircle,
  renderClinvar,
  renderOmim,
} from 'views/Variants/components/PageContent/VariantsTable/utils';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import ManeCell from 'components/ManeCell';
import { SetType } from 'services/api/savedSet/models';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { isNumber } from 'utils/helper';
import { STATIC_ROUTES } from 'utils/routes';
import { getProTableDictionary } from 'utils/translation';

import { SCROLL_WRAPPER_ID, VARIANT_SOMATIC_SAVED_SETS_FIELD } from '../../../utils/constants';

import { CmcTierColorMap } from './utils';

import styles from './index.module.css';

interface OwnProps {
  pageIndex: number;
  sqon?: ISqonGroupFilter;
  setPageIndex: (value: number) => void;
  results: IQueryResults<IVariantSomaticEntity[]>;
  setQueryConfig: TQueryConfigCb;
  queryConfig: IQueryConfig;
  queryBuilderId: string;
}

const getDefaultColumns = (queryBuilderId: string, noData: boolean = false): ProColumnType[] => [
  {
    title: intl.get('screen.variantsSomatic.table.variant'),
    key: 'hgvsg',
    dataIndex: 'hgvsg',
    className: noData
      ? `${styles.fixedVariantTableCellNoData} ${styles.fixedVariantTableCellElipsis}`
      : styles.fixedVariantTableCellElipsis,
    sorter: {
      multiple: 1,
    },
    fixed: 'left',
    render: (hgvsg: string, entity: IVariantSomaticEntity) =>
      hgvsg ? (
        <Tooltip placement="topLeft" title={hgvsg}>
          <div>
            <Link to={`${STATIC_ROUTES.VARIANTS}/${entity?.locus}`}>{hgvsg}</Link>
          </div>
        </Tooltip>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    width: 150,
  },
  {
    key: 'variant_class',
    title: intl.get('screen.variantsSomatic.table.type'),
    dataIndex: 'variant_class',
    sorter: {
      multiple: 1,
    },
    render: (variant_class: string) =>
      variant_class ? (
        <Tooltip
          title={intl
            .get(`entities.variant.type.tooltip.${variant_class.toLowerCase()}`)
            .defaultMessage(capitalize(variant_class))}
        >
          {intl
            .get(`entities.variant.type.abrv.${variant_class.toLowerCase()}`)
            .defaultMessage(capitalize(variant_class))}
        </Tooltip>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    width: 65,
  },
  {
    key: 'rsnumber',
    title: intl.get('screen.variantsSomatic.table.dbsnp'),
    dataIndex: 'rsnumber',
    className: styles.dbSnpTableCell,
    render: (rsNumber: string) =>
      rsNumber ? (
        <ExternalLink href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`}>
          <ExternalLinkIcon />
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    width: 65,
  },
  {
    title: intl.get('screen.variantsSomatic.table.gene'),
    key: 'genes.symbol',
    dataIndex: 'genes',
    render: (genes: IArrangerResultsTree<IGeneEntity>) => {
      const geneWithPickedConsequence = genes?.hits?.edges?.find((e) =>
        (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
      )?.node;
      if (!geneWithPickedConsequence) {
        //must never happen or it is a bug
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      const geneSymbol = geneWithPickedConsequence.symbol;
      const geneInfo = genes.hits.edges.find(({ node }) => node.symbol === geneSymbol);

      return (
        <GeneCell
          queryBuilderId={queryBuilderId}
          queryValue={geneSymbol}
          queryIndex={INDEXES.VARIANTS}
          symbol={geneSymbol}
          omimGeneId={geneInfo?.node.omim_gene_id}
        />
      );
    },
    width: 100,
  },
  {
    key: 'consequences',
    title: intl.get('screen.variantsSomatic.table.mostDeleteriousConsequence.title'),
    dataIndex: 'genes',
    tooltip: intl.get('screen.variantsSomatic.table.mostDeleteriousConsequence.tooltip'),
    className: noData ? styles.csqCell : '',
    render: (genes: IArrangerResultsTree<IGeneEntity>) => {
      const geneWithPickedConsequence = genes?.hits?.edges?.find((e) =>
        (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
      )?.node;
      if (!geneWithPickedConsequence) {
        //must never happen or it is a bug
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      const consequences = geneWithPickedConsequence.consequences?.hits?.edges;
      return (
        <ConsequencesCell
          consequences={consequences}
          emptyText={intl.get('no.data.available')}
          layoutClassName={styles.csqCellLayout}
          symbol={geneWithPickedConsequence.symbol}
          withoutSymbol
        />
      );
    },
    width: 180,
  },
  {
    key: 'MANE',
    title: intl.get('screen.variantsSomatic.table.mane'),
    dataIndex: 'genes',
    render: (genes: IArrangerResultsTree<IGeneEntity>) => {
      const geneWithPickedConsequence = genes?.hits?.edges?.find((e) =>
        (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
      )?.node;
      if (!geneWithPickedConsequence) {
        //must never happen or it is a bug
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      const pickedConsequence = geneWithPickedConsequence.consequences?.hits?.edges?.find(
        (c) => c.node.picked,
      );

      return pickedConsequence ? (
        <ManeCell consequence={pickedConsequence.node} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      );
    },
    width: 80,
  },
  {
    key: 'genes.omim.inheritance',
    title: intl.get('screen.variantsSomatic.table.omim.title'),
    tooltip: intl.get('screen.variantsSomatic.table.omim.tooltip'),
    dataIndex: 'genes',
    render: (genes: IArrangerResultsTree<IGeneEntity>) => {
      const geneWithPickedConsequence = genes?.hits?.edges?.find((e) =>
        (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
      )?.node;
      if (!geneWithPickedConsequence) {
        //must never happen or it is a bug
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      return renderOmim(genes, geneWithPickedConsequence.symbol);
    },
    width: 95,
  },
  {
    key: 'hotspot',
    title: intl.get('entities.variant_somatic.hotspot'),
    iconTitle: <FireOutlined className={styles.hotspotHeader} />,
    dataIndex: 'hotspot',
    width: 70,
    sorter: {
      multiple: 1,
    },
    render: (hotspot: string) => {
      if (hotspot === null || hotspot === undefined) return TABLE_EMPTY_PLACE_HOLDER;
      return hotspot ? (
        <FireFilled className={styles.hotspotTrue} />
      ) : (
        <FireOutlined className={styles.hotspotFalse} />
      );
    },
  },
  {
    key: 'cmc.sample_mutated',
    title: intl.get('screen.variantsSomatic.table.cmc.title'),
    tooltip: intl.get('screen.variantsSomatic.table.cmc.tooltip'),
    sorter: {
      multiple: 1,
    },
    render: (variant: IVariantSomaticEntity) => {
      const cmc = variant.cmc;
      if (!cmc?.sample_mutated) return TABLE_EMPTY_PLACE_HOLDER;
      return (
        <>
          <ExternalLink href={cmc.mutation_url}>{cmc.sample_mutated}</ExternalLink> (
          {toExponentialNotation(cmc.sample_ratio)})
        </>
      );
    },
    width: 95,
  },
  {
    key: 'cmc.tier',
    title: intl.get('entities.variant_somatic.cmcTier'),
    render: (variant: IVariantSomaticEntity) => (
      <Tag color={variant.cmc?.tier ? CmcTierColorMap[variant.cmc.tier] : 'default'}>
        {intl.get(
          variant.cmc?.tier
            ? `screen.variantsSomatic.table.cmc.tier.${variant.cmc.tier}`
            : 'screen.variantsSomatic.table.cmc.tier.null',
        )}
      </Tag>
    ),
    width: 90,
  },
  {
    key: 'clinvar.clin_sig',
    title: intl.get('screen.variantsSomatic.table.clinvar'),
    dataIndex: 'clinvar',
    render: (clinVar: IClinVar) => renderClinvar(clinVar),
    width: 92,
  },
  {
    key: 'external_frequencies.gnomad_genomes_3.af',
    title: intl.get('screen.variantsSomatic.table.gnomAD.title'),
    tooltip: intl.get('screen.variantsSomatic.table.gnomAD.tooltip'),
    dataIndex: 'external_frequencies',
    sorter: {
      multiple: 1,
    },
    defaultHidden: true,
    render: (externalFrequencies: IExternalFrequenciesEntity) => {
      const af = externalFrequencies?.gnomad_genomes_3?.af;
      if (!af) return TABLE_EMPTY_PLACE_HOLDER;
      return (
        <Space direction="horizontal">
          <GnomadCircle underOnePercent={af < 0.01} />
          <span>{toExponentialNotation(af)}</span>
        </Space>
      );
    },
    width: 90,
  },
  {
    key: 'external_frequencies.gnomad_genomes_3.ac',
    title: intl.get('screen.variantsSomatic.table.gnomADAlt.title'),
    tooltip: intl.get('screen.variantsSomatic.table.gnomADAlt.tooltip'),
    dataIndex: 'external_frequencies',
    sorter: {
      multiple: 1,
    },
    defaultHidden: true,
    render: (externalFrequencies: IExternalFrequenciesEntity) =>
      externalFrequencies?.gnomad_genomes_3?.ac
        ? numberWithCommas(externalFrequencies?.gnomad_genomes_3?.ac)
        : TABLE_EMPTY_PLACE_HOLDER,
    width: 90,
  },
  {
    title: intl.get('screen.variantsSomatic.table.studies.title'),
    tooltip: intl.get('screen.variantsSomatic.table.studies.tooltip'),
    dataIndex: 'studies',
    key: 'studies.study_code',
    render: (studies: IArrangerResultsTree<IVariantStudyEntity>) => {
      const total = studies?.hits?.total ?? 0;
      if (total == 0) {
        return total;
      }

      const ids = hydrateResults(studies?.hits?.edges || []).map(
        (node: IVariantStudyEntity) => node.study_code,
      );

      return (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
          onClick={() => {
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'study.study_code',
                    value: ids,
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            });
          }}
        >
          {numberWithCommas(total)}
        </Link>
      );
    },
    width: 80,
  },
  {
    title: intl.get('screen.variantsSomatic.table.participant.title'),
    tooltip: intl.get('screen.variantsSomatic.table.participant.tooltip'),
    key: 'internal_frequencies.total.pc',
    sorter: {
      multiple: 1,
    },
    render: (v: IVariantSomaticEntity) => {
      const totalNbOfParticipants = v.internal_frequencies?.total?.pc || 0;
      const studies = v.studies;
      const participantIds =
        studies?.hits?.edges?.map((study) => study.node.participant_ids || [])?.flat() || [];
      if (!participantIds.length) {
        return (
          <>
            {totalNbOfParticipants}
            {v.internal_frequencies?.total?.pf && isNumber(v.internal_frequencies.total.pf) && (
              <span className={styles.partCell}>
                ({toExponentialNotation(v.internal_frequencies.total.pf)})
              </span>
            )}
          </>
        );
      }
      return (
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
          {v.internal_frequencies?.total?.pf && isNumber(v.internal_frequencies.total.pf) && (
            <span className={styles.partCell}>
              ({toExponentialNotation(v.internal_frequencies.total.pf)})
            </span>
          )}
        </>
      );
    },
    width: 125,
  },
  {
    title: intl.get('screen.variantsSomatic.table.freq.title'),
    tooltip: intl.get('screen.variantsSomatic.table.freq.tooltip'),
    dataIndex: ['internal_frequencies', 'total', 'af'],
    key: 'internal_frequencies.total.af',
    render: (af: number) =>
      af && isNumber(af) ? toExponentialNotation(af) : TABLE_EMPTY_PLACE_HOLDER,
    width: 80,
  },
  {
    key: 'genes.consequences.predictions.cadd_phred',
    title: intl.get('screen.variantsSomatic.table.CADD.title'),
    tooltip: intl.get('screen.variantsSomatic.table.CADD.tooltip'),
    dataIndex: 'genes',
    defaultHidden: true,
    render: (genes: IArrangerResultsTree<IGeneEntity>) => {
      const geneWithPickedConsequence = genes?.hits?.edges?.find((e) =>
        (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
      )?.node;
      if (!geneWithPickedConsequence) {
        //must never happen or it is a bug
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      const pickedConsequence = geneWithPickedConsequence.consequences?.hits?.edges?.find(
        (c) => c.node.picked,
      );
      return pickedConsequence?.node?.predictions?.cadd_phred
        ? pickedConsequence.node.predictions.cadd_phred
        : TABLE_EMPTY_PLACE_HOLDER;
    },
    width: 90,
  },
  {
    key: 'genes.consequences.predictions.revel_score',
    title: intl.get('screen.variantsSomatic.table.revel'),
    dataIndex: 'genes',
    defaultHidden: true,
    render: (genes: IArrangerResultsTree<IGeneEntity>) => {
      const geneWithPickedConsequence = genes?.hits?.edges?.find((e) =>
        (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
      )?.node;
      if (!geneWithPickedConsequence) {
        //must never happen or it is a bug
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      const pickedConsequence = geneWithPickedConsequence.consequences?.hits?.edges?.find(
        (c) => c.node.picked,
      );
      return pickedConsequence?.node?.predictions?.revel_score
        ? pickedConsequence.node.predictions.revel_score
        : TABLE_EMPTY_PLACE_HOLDER;
    },
    width: 90,
  },
  {
    title: intl.get('screen.variantsSomatic.table.alt.title'),
    tooltip: intl.get('screen.variantsSomatic.table.alt.tooltip'),
    dataIndex: ['internal_frequencies', 'total', 'ac'],
    defaultHidden: true,
    key: 'internal_frequencies.total.ac',
    render: (ac: string) =>
      ac && !isNaN(parseInt(ac)) ? numberWithCommas(parseInt(ac)) : TABLE_EMPTY_PLACE_HOLDER,
    width: 60,
  },
  {
    title: intl.get('screen.variantsSomatic.table.homozygotes.title'),
    tooltip: intl.get('screen.variantsSomatic.table.homozygotes.tooltip'),
    dataIndex: 'internal_frequencies',
    defaultHidden: true,
    key: 'internal_frequencies.total.hom',
    render: (internalFrequencies: IVariantInternalFrequencies) =>
      internalFrequencies.total.hom || internalFrequencies.total.hom === 0
        ? numberWithCommas(internalFrequencies.total.hom)
        : TABLE_EMPTY_PLACE_HOLDER,
    width: 75,
  },
];

const VariantsTable = ({
  results,
  sqon,
  setQueryConfig,
  queryConfig,
  pageIndex,
  setPageIndex,
  queryBuilderId,
}: OwnProps) => {
  const dispatch = useDispatch();
  const { filters }: { filters: ISyntheticSqon } = useFilters();
  const { userInfo } = useUser();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [selectedRows, setSelectedRows] = useState<IVariantSomaticEntity[]>([]);
  const [selectedAllResults, setSelectedAllResults] = useState(false);

  const getCurrentSqon = (): any =>
    selectedAllResults || !selectedKeys.length
      ? sqon
      : generateQuery({
          newFilters: [
            generateValueFilter({
              field: 'locus',
              index: INDEXES.VARIANTS,
              value: selectedRows.map((row) => row.locus),
            }),
          ],
        });

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(filters)]);

  const initialColumns = userInfo?.config.variants?.tables?.variants?.columns;

  return (
    <GridCard
      content={
        <FixedSizeTable
          elementId="query-builder-header-tools"
          fixedProTable={(dimension) => (
            <ProTable<ITableVariantSomaticEntity>
              tableId="variants_table"
              columns={getDefaultColumns(queryBuilderId, results.data.length === 0 ? true : false)}
              enableRowSelection
              initialColumnState={initialColumns}
              wrapperClassName={styles.variantTabWrapper}
              loading={results.loading}
              initialSelectedKey={selectedKeys}
              showSorterTooltip={false}
              // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
              onChange={({ current }, _, sorter) => {
                setPageIndex(DEFAULT_PAGE_INDEX);
                setQueryConfig({
                  pageIndex: DEFAULT_PAGE_INDEX,
                  size: queryConfig.size!,
                  sort: formatQuerySortList(sorter),
                });
              }}
              headerConfig={{
                itemCount: {
                  pageIndex: pageIndex,
                  pageSize: queryConfig.size,
                  total: results.total,
                },
                enableColumnSort: true,
                onColumnSortChange: (newState) =>
                  dispatch(
                    updateUserConfig({
                      variants: {
                        tables: {
                          variants: {
                            columns: newState,
                          },
                        },
                      },
                    }),
                  ),
                onSelectAllResultsChange: setSelectedAllResults,
                onSelectedRowsChange: (keys, selectedRows) => {
                  setSelectedKeys(keys);
                  setSelectedRows(selectedRows);
                },
                extra: [
                  // TODO SKFP-1443
                  <SetsManagementDropdown
                    idField={VARIANT_SOMATIC_SAVED_SETS_FIELD}
                    results={results}
                    selectedKeys={selectedKeys}
                    selectedAllResults={selectedAllResults}
                    sqon={getCurrentSqon()}
                    type={SetType.VARIANT}
                    key="variants-somatic-set-management"
                  />,
                ],
              }}
              bordered
              size="small"
              scroll={{ x: dimension.x, y: 'max-content' }}
              pagination={{
                current: pageIndex,
                queryConfig,
                setQueryConfig,
                onChange: (page: number) => {
                  scrollToTop(SCROLL_WRAPPER_ID);
                  setPageIndex(page);
                },
                searchAfter: results.searchAfter,
                onViewQueryChange: (viewPerQuery: PaginationViewPerQuery) => {
                  dispatch(
                    updateUserConfig({
                      variants: {
                        tables: {
                          variants: {
                            ...userInfo?.config.variants?.tables?.variants,
                            viewPerQuery,
                          },
                        },
                      },
                    }),
                  );
                },
                defaultViewPerQuery: queryConfig.size,
              }}
              dataSource={results.data.map((i) => ({ ...i, key: i.id }))}
              dictionary={getProTableDictionary()}
            />
          )}
        />
      }
    />
  );
};

export default VariantsTable;
