import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import EntityPageWrapper, {
  EntityPublicCohortTable,
  EntityTable,
  EntityTitle,
} from '@ferlab/ui/core/pages/EntityPage';
import { makeClinvarRows } from '@ferlab/ui/core/pages/EntityPage/utils/pathogenicity';
import { Space, Tag } from 'antd';
import { ArrangerEdge } from 'graphql/models';
import { makeGenesOrderedRow } from 'views/VariantEntity/FerlabComponent/Pathogenecity.utils';

import LineStyleIcon from 'components/Icons/LineStyleIcon';

import { useVariantEntity } from '../../graphql/variants/actions';
import { IVariantStudyEntity } from '../../graphql/variants/models';

import {
  getFrequenciesItems,
  getFrequenciesTableSummaryColumns,
  getPublicCohorts,
} from './utils/frequency';
import { getClinvarColumns, getGenePhenotypeColumns } from './utils/pathogenicity';

import styles from './index.module.scss';

enum SectionId {
  SUMMARY = 'summary',
  CONSEQUENCE = 'consequence',
  FREQUENCY = 'frequency',
  PATHOGENICITY = 'pathogenicity',
  CONDITIONS = 'conditions',
}

export default function VariantEntity() {
  const { locus } = useParams<{ locus: string }>();

  const links: IAnchorLink[] = [
    { href: `#${SectionId.SUMMARY}`, title: intl.get('screen.variants.summary.summary') },
    {
      href: `#${SectionId.CONSEQUENCE}`,
      title: intl.get('screen.variants.consequences.consequence'),
    },
    { href: `#${SectionId.FREQUENCY}`, title: intl.get('screen.variants.frequencies.frequency') },
    {
      href: `#${SectionId.PATHOGENICITY}`,
      title: intl.get('screen.variants.pathogenicity.pathogenicity'),
    },
    {
      href: `#${SectionId.CONDITIONS}`,
      title: intl.get('screen.variants.conditions.title'),
    },
  ];

  const { data, loading } = useVariantEntity({
    field: 'locus',
    values: locus ? [locus] : [],
  });

  const variantStudies = (data?.studies.hits.edges || []).map(
    (e: ArrangerEdge<IVariantStudyEntity>) => e.node,
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
          tag={
            <>
              <Tag>{data?.assembly_version}</Tag>
              <Tag className={styles.variantTag}>
                {intl.get('screen.variants.summary.germline')}
              </Tag>
            </>
          }
        />

        <EntityTable
          id={SectionId.FREQUENCY}
          columns={getFrequenciesItems()}
          data={variantStudies}
          title={intl.get('screen.variants.frequencies.frequency')}
          header={intl.get('screen.variants.frequencies.kfStudies')}
          loading={loading}
          summaryColumns={getFrequenciesTableSummaryColumns(data, variantStudies)}
        />

        <EntityPublicCohortTable
          columns={getPublicCohorts()}
          frequencies={data?.external_frequencies}
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
          id={SectionId.CONDITIONS}
          loading={loading}
          title={intl.get('screen.variants.pathogenicity.condition')}
          header={intl.get('screen.variants.pathogenicity.genePhenotype')}
          data={makeGenesOrderedRow(data?.genes)}
          columns={getGenePhenotypeColumns()}
        />
      </>
    </EntityPageWrapper>
  );
}
