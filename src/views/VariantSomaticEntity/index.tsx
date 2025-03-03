import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { NO_GENE } from '@ferlab/ui/core/components/Consequences/Cell';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import EntityPageWrapper, {
  EntityPublicCohortTable,
  EntityTable,
  EntityTitle,
} from '@ferlab/ui/core/pages/EntityPage';
import EntityNestedTable from '@ferlab/ui/core/pages/EntityPage/EntityNestedTable';
import EntityVariantSummary from '@ferlab/ui/core/pages/EntityPage/EntityVariantSummary';
import {
  makeClinvarRows,
  makeGenesOrderedRow,
} from '@ferlab/ui/core/pages/EntityPage/utils/pathogenicity';
import { Space, Tag, Tooltip } from 'antd';
import { ArrangerEdge } from 'graphql/models';
import { useStudiesEntity } from 'graphql/studies/actions';
import { useVariantSomaticEntity } from 'graphql/variants/actions';
import { IVariantStudyEntity } from 'graphql/variants/models';
import { links, SectionId } from 'views/VariantEntity/utils/anchorMenu';
import { expandedRowRender, getColumn } from 'views/VariantEntity/utils/consequence';
import {
  getFrequencyItems,
  getFrequencyTableSummaryColumns,
  getPublicCohorts,
} from 'views/VariantEntity/utils/frequency';
import {
  getClinvarColumns,
  getGenePhenotypeColumns,
} from 'views/VariantEntity/utils/pathogenicity';
import { VARIANT_REPO_QB_ID } from 'views/Variants/utils/constants';

import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import { STATIC_ROUTES } from 'utils/routes';

import { getSummaryItems } from './utils/summary';

import styles from './index.module.css';

export default function VariantSomaticEntity() {
  const { locus } = useParams<{ locus: string }>();

  const { data, loading } = useVariantSomaticEntity({
    field: 'locus',
    values: locus ? [locus] : [],
  });

  const variantStudies = (data?.studies.hits.edges || []).map(
    (e: ArrangerEdge<IVariantStudyEntity>) => e.node,
  );

  const studiesCodes = variantStudies.map((variant: IVariantStudyEntity) => variant.study_code);
  const studies = useStudiesEntity({
    field: 'study_code',
    values: studiesCodes,
  });

  const geneSymbolOfPicked = data?.genes?.hits?.edges?.find((e) =>
    (e.node.consequences || [])?.hits?.edges?.some((e) => e.node?.picked),
  )?.node?.symbol;

  return (
    <EntityPageWrapper
      pageId="variant-somatic-entity-page"
      links={links}
      data={data}
      loading={loading}
      emptyText={intl.get('no.data.available')}
    >
      <div className={styles.contentWrapper}>
        <EntityTitle
          text={data?.hgvsg}
          icon={<LineStyleIcon className={styles.titleIcon} />}
          loading={loading}
          tag={
            <>
              <Tag className={styles.titleTag}>{data?.assembly_version}</Tag>
              <Tag className={styles.titleTag} color="cyan">
                {intl.get('screen.variantsSomatic.summary.somaticTag')}
              </Tag>
              <Tooltip title={intl.get('screen.variantsSomatic.germlineLinkTooltip')}>
                <Link
                  to={STATIC_ROUTES.VARIANTS}
                  className={styles.germlineLink}
                  onClick={() =>
                    addQuery({
                      queryBuilderId: VARIANT_REPO_QB_ID,
                      query: generateQuery({
                        newFilters: [
                          generateValueFilter({
                            field: 'locus',
                            value: data?.locus ? [data.locus] : [],
                          }),
                        ],
                      }),
                      setAsActive: true,
                    })
                  }
                >
                  {intl.get('screen.variantsSomatic.germlineLink')}{' '}
                  <ExternalLinkIcon height="16" width="16" />
                </Link>
              </Tooltip>
            </>
          }
        />

        <EntityVariantSummary
          id={SectionId.SUMMARY}
          loading={loading}
          data={getSummaryItems(data)}
          noDataLabel={intl.get('no.data.available')}
          theme="basic-bordered"
        />

        <EntityNestedTable
          columns={getColumn(geneSymbolOfPicked)}
          data={hydrateResults(data?.genes?.hits?.edges || []).filter(
            (gene) => gene.symbol !== NO_GENE,
          )}
          expandedRowRender={(row) => expandedRowRender(row, data)}
          id={SectionId.CONSEQUENCE}
          loading={loading}
          title={intl.get('screen.variants.consequences.consequence')}
          header={intl.get('screen.variants.consequences.transcripts')}
          noDataLabel={intl.get('no.data.available')}
        />

        <EntityTable
          id={SectionId.FREQUENCY}
          columns={getFrequencyItems({ isSomatic: true, studies: studies.data || [] })}
          data={variantStudies}
          title={intl.get('screen.variants.frequencies.frequency')}
          header={intl.get('screen.variants.frequencies.kfStudies')}
          loading={loading}
          summaryColumns={getFrequencyTableSummaryColumns(data, variantStudies)}
        />

        <EntityPublicCohortTable
          columns={getPublicCohorts()}
          frequencies={data?.external_frequencies}
          locus={data?.locus}
          header={intl.get('screen.variants.frequencies.publicCohorts')}
          id=""
          loading={loading}
          emptyMessage={intl.get('no.data.available')}
        />

        <EntityTable
          id={SectionId.PATHOGENICITY}
          loading={loading}
          title={intl.get('screen.variants.pathogenicity.pathogenicity')}
          header={
            <Space size={4}>
              {intl.get('screen.variants.pathogenicity.clinVar')}
              {data?.clinvar?.clinvar_id && (
                <ExternalLink
                  href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${data?.clinvar.clinvar_id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {data?.clinvar?.clinvar_id}
                </ExternalLink>
              )}
            </Space>
          }
          data={makeClinvarRows(data?.clinvar)}
          columns={getClinvarColumns()}
        />

        <EntityTable
          id={SectionId.CONDITION}
          loading={loading}
          title={intl.get('screen.variants.conditions.title')}
          header={intl.get('screen.variants.conditions.tableTitle')}
          data={makeGenesOrderedRow(data?.genes)}
          columns={getGenePhenotypeColumns()}
        />
      </div>
    </EntityPageWrapper>
  );
}
