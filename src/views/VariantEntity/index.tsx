import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import EntityPageWrapper, {
  EntityGeneConsequences,
  EntityPublicCohortTable,
  EntitySummary,
  EntityTable,
  EntityTitle,
} from '@ferlab/ui/core/pages/EntityPage';
import {
  makeClinvarRows,
  makeGenesOrderedRow,
} from '@ferlab/ui/core/pages/EntityPage/utils/pathogenicity';
import { Space, Tag } from 'antd';
import { useVariantEntity } from 'graphql/variants/actions';

import LineStyleIcon from 'components/Icons/LineStyleIcon';
import { getEntityExpandableTableMultiple } from 'utils/translation';

import { getConsequencesProColumn } from './utils/consequences';
import {
  getFrequenciesItems,
  getFrequenciesTableSummaryColumns,
  getPublicCohorts,
} from './utils/frequencies';
import { getClinvarColumns, getGenePhenotypeColumns } from './utils/pathogenicity';
import { getSummaryItems } from './utils/summary';
import SummaryHeader from './SummaryHeader';

import styles from './index.module.scss';

enum SectionId {
  SUMMARY = 'summary',
  CONSEQUENCE = 'consequence',
  FREQUENCIES = 'frequencies',
  PATHOGENICITY = 'pathogenicity',
}

export default function VariantEntity() {
  const { locus } = useParams<{ locus: string }>();

  const links: IAnchorLink[] = [
    { href: `#${SectionId.SUMMARY}`, title: intl.get('screen.variants.summary.summary') },
    {
      href: `#${SectionId.CONSEQUENCE}`,
      title: intl.get('screen.variants.consequences.consequence'),
    },
    { href: `#${SectionId.FREQUENCIES}`, title: intl.get('screen.variants.frequencies.frequency') },
    {
      href: `#${SectionId.PATHOGENICITY}`,
      title: intl.get('screen.variants.pathogenicity.pathogenicity'),
    },
  ];

  const { data, loading } = useVariantEntity({
    field: 'locus',
    values: [locus],
  });

  const variantStudies = hydrateResults(data?.studies.hits.edges || []).map(
    (e: any, index: number) => ({
      ...e,
      key: index,
      participant_total_number: data?.participant_total_number || 0,
    }),
  );

  return (
    <EntityPageWrapper
      pageId="variant-entity-page"
      links={links}
      data={data}
      loading={loading}
      emptyText={intl.get('no.data.available')}
    >
      <>
        <EntityTitle
          text={data?.hgvsg}
          icon={<LineStyleIcon className={styles.titleIcon} />}
          loading={loading}
          tag={<Tag className={styles.variantTag}>Germline</Tag>}
        />

        <EntitySummary
          id={SectionId.SUMMARY}
          title={intl.get('screen.variants.summary.summary')}
          header={<SummaryHeader variant={data} />}
          data={getSummaryItems(data)}
          loading={loading}
        />

        <EntityGeneConsequences
          id={SectionId.CONSEQUENCE}
          dictionary={getEntityExpandableTableMultiple()}
          loading={loading}
          title={intl.get('screen.variants.consequences.consequence')}
          header={intl.get('screen.variants.consequences.geneConsequence')}
          columns={getConsequencesProColumn()}
          genes={data?.genes.hits.edges}
          consequences={data?.consequences.hits.edges}
        />

        <EntityTable
          id={SectionId.FREQUENCIES}
          columns={getFrequenciesItems()}
          data={variantStudies}
          title={intl.get('screen.variants.frequencies.frequency')}
          header={intl.get('screen.variants.frequencies.kfStudies')}
          loading={loading}
          summaryColumns={getFrequenciesTableSummaryColumns(data, variantStudies)}
        />

        <EntityPublicCohortTable
          columns={getPublicCohorts()}
          frequencies={data?.frequencies}
          locus={data?.locus}
          header={intl.get('screen.variants.frequencies.publicCohorts')}
          id=""
          loading={loading}
          emptyMessage={intl.get('screen.variants.frequencies.noDataAvailable')}
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
                  hasIcon
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
          id=""
          loading={loading}
          header={intl.get('screen.variants.pathogenicity.genePhenotype')}
          data={makeGenesOrderedRow(data?.genes)}
          columns={getGenePhenotypeColumns()}
        />
      </>
    </EntityPageWrapper>
  );
}
