import intl from 'react-intl-universal';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { IEntitySummaryColumns } from '@ferlab/ui/core/pages/EntityPage/EntitySummary';
import { numberWithCommas, toExponentialNotation } from '@ferlab/ui/core/utils/numberUtils';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';
import { IVariantEntity } from '../../../graphql/variants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

import styles from '../index.module.scss';

export const getSummaryItems = (variant?: IVariantEntity): IEntitySummaryColumns[] => [
  {
    column: {
      lg: 12,
      md: 24,
      xs: 24,
    },
    rows: [
      {
        title: '',
        data: [
          {
            label: intl.get('screen.variants.summary.variant'),
            value: variant?.hgvsg || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.type'),
            value: variant?.variant_class || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.cytoband'),
            value: variant?.genes?.hits?.edges[0]
              ? variant.genes.hits.edges[0].node.location
              : TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.referenceGenome'),
            value: variant?.assembly_version || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.genes'),
            value: variant?.genes?.hits?.edges?.length
              ? variant.genes.hits.edges.map((gene) => {
                  if (!gene?.node?.symbol) {
                    return;
                  }
                  return (
                    <ExternalLink
                      key={gene.node.symbol}
                      className={styles.geneExternalLink}
                      href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.node.symbol}`}
                    >
                      {gene.node.symbol}
                    </ExternalLink>
                  );
                })
              : TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.omim'),
            value: variant?.genes?.hits?.edges?.length
              ? variant.genes.hits.edges.map((gene) => {
                  if (!gene?.node?.omim_gene_id) {
                    return;
                  }
                  return (
                    <ExternalLink
                      key={gene.node.omim_gene_id}
                      className={styles.geneExternalLink}
                      href={`https://omim.org/entry/${gene.node.omim_gene_id}`}
                    >
                      {gene.node.omim_gene_id}
                    </ExternalLink>
                  );
                })
              : TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.clinVar'),
            value:
              removeUnderscoreAndCapitalize(
                variant?.clinvar?.clin_sig.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
              ) || TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.participants'),
            value: variant?.internal_frequencies?.total?.pc
              ? numberWithCommas(variant.internal_frequencies.total.pc)
              : TABLE_EMPTY_PLACE_HOLDER,
          },
        ],
      },
    ],
  },
  {
    column: {
      lg: 12,
      md: 24,
      xs: 24,
    },
    rows: [
      {
        title: 'Frequencies',
        data: [
          {
            label: intl.get('screen.variants.summary.gnomadGenome3'),
            value:
              toExponentialNotation(variant?.external_frequencies?.gnomad_genomes_3?.af) ||
              TABLE_EMPTY_PLACE_HOLDER,
          },
          {
            label: intl.get('screen.variants.summary.studies'),
            value: variant?.studies?.hits?.edges?.length || TABLE_EMPTY_PLACE_HOLDER,
          },
        ],
      },
      {
        title: 'External Reference',
        data: [
          {
            label: intl.get('screen.variants.summary.clinVar'),
            value: variant?.clinvar?.clinvar_id ? (
              <ExternalLink
                href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${variant.clinvar.clinvar_id}`}
              >
                {variant?.clinvar?.clinvar_id}
              </ExternalLink>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            ),
          },
          {
            label: intl.get('screen.variants.summary.dbSNP'),
            value: variant?.rsnumber ? (
              <ExternalLink href={`https://www.ncbi.nlm.nih.gov/snp/${variant?.rsnumber}`}>
                {variant?.rsnumber}
              </ExternalLink>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            ),
          },
        ],
      },
    ],
  },
];
