import intl from 'react-intl-universal';
import { TABLE_EMPTY_PLACE_HOLDER } from '@ferlab/ui/core/common/constants';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Space, Tag, Tooltip } from 'antd';
import cx from 'classnames';
import { IClinVar, IGeneEntity } from 'graphql/variants/models';

import style from './index.module.css';

export const ClinvarColorMap: Record<any, string> = {
  affects: 'default',
  association: 'default',
  association_not_found: 'default',
  benign: 'green',
  confers_sensitivity: 'default',
  conflicting_classifications_of_pathogenicity: 'volcano',
  conflicting_interpretations_of_pathogenicity: 'orange',
  drug_response: 'default',
  likely_benign: 'lime',
  likely_pathogenic: 'volcano',
  likely_risk_allele: 'default',
  low_penetrance: 'default',
  no_classification_for_the_single_variant: 'default',
  not_provided: 'default',
  other: 'default',
  pathogenic: 'red',
  protective: 'default',
  risk_factor: 'default',
  uncertain_risk_allele: 'default',
  uncertain_significance: 'orange',
};

export const renderOmim = (
  genes: IArrangerResultsTree<IGeneEntity>,
  pickedConsequenceSymbol: string | undefined,
) => {
  const genesWithOmim = genes.hits.edges.filter((gene) => gene.node.omim?.hits?.edges?.length);

  const pickedConsequenceGeneWithOmim = genesWithOmim.filter(
    ({ node }) => node.symbol === pickedConsequenceSymbol,
  );

  if (!genesWithOmim.length || !pickedConsequenceGeneWithOmim.length) {
    return TABLE_EMPTY_PLACE_HOLDER;
  }

  const pickedOmim = pickedConsequenceGeneWithOmim[0];
  const omimLink = `https://www.omim.org/entry/${pickedOmim.node.omim_gene_id}`;

  const omims = pickedOmim.node.omim?.hits?.edges || [];
  const inheritance = omims
    .reduce<string[]>((prev, curr) => [...prev, ...(curr.node.inheritance_code || [])], [])
    .filter((item, pos, self) => self.indexOf(item) == pos);

  if (!inheritance.length) {
    return (
      <Tooltip title={intl.get(`screen.variants.table.inheritant.code.NRT`)}>
        <ExternalLink href={omimLink}>NRT</ExternalLink>
      </Tooltip>
    );
  }

  return (
    <StackLayout horizontal>
      <Space size={4} className={style.variantSnvOmimCellItem}>
        {inheritance.length
          ? inheritance.map((code) => (
              <Tooltip key={code} title={intl.get(`screen.variants.table.inheritant.code.${code}`)}>
                <Tag color="blue">
                  <ExternalLink href={omimLink}>{code}</ExternalLink>
                </Tag>
              </Tooltip>
            ))
          : TABLE_EMPTY_PLACE_HOLDER}
      </Space>
    </StackLayout>
  );
};

export const renderClinvar = (clinVar: IClinVar) => {
  const clinVarSigKey: string[] = [];

  clinVar?.clin_sig &&
    clinVar.clin_sig.map((c) => {
      clinVarSigKey.push(c.toLowerCase());
    });

  return clinVar?.clin_sig && clinVar.clinvar_id
    ? clinVarSigKey.map((clinvarKey) => (
        <Tooltip
          key={clinvarKey}
          placement="topLeft"
          title={intl.get(`screen.variants.table.clinvarTooltip.${clinvarKey}`)}
        >
          <Tag color={ClinvarColorMap[clinvarKey]}>
            <ExternalLink
              href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clinvar_id}`}
            >
              {intl.get(`screen.variants.table.clinvarAbrv.${clinvarKey}`)}
            </ExternalLink>
          </Tag>
        </Tooltip>
      ))
    : TABLE_EMPTY_PLACE_HOLDER;
};

interface GnomadCircleProps {
  underOnePercent: boolean;
}

export const GnomadCircle = ({ underOnePercent }: GnomadCircleProps) => (
  <div
    className={cx(
      underOnePercent ? style.gnomadIndicatorRed : style.gnomadIndicatorDefault,
      style.gnomadIndicator,
    )}
  />
);
