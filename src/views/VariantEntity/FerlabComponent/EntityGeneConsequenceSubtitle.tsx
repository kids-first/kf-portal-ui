import React from 'react';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { IArrangerEdge } from '@ferlab/ui/core/graphql/types';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';

import { IGeneEntity } from '../../../graphql/variants/models';

import styles from '@ferlab/ui/core/pages/EntityPage/EntityGeneConsequence/EntityGeneConsequenceSubtitle/index.module.scss';

export interface IGeneConsquenceTableGroup {
  gene: IArrangerEdge<IGeneEntity>;
  ensembleGeneId: string;
}

interface IEntityGeneConsequenceSubtitle extends Omit<IGeneConsquenceTableGroup, 'ensembleGeneId'> {
  dictionary: {
    gene: string;
    omim: string;
    spliceai: string;
    gnomad_pli: string;
    gnomad_loeuf: string;
  };
}

const EntityGeneConsequenceSubtitle = ({
  gene,
  dictionary,
}: IEntityGeneConsequenceSubtitle): React.ReactElement => (
  <div className={styles.wrapper}>
    <span>
      <span className={styles.bold}>{dictionary.gene}:</span>
      <ExternalLink
        className={styles.link}
        href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene?.node?.symbol}`}
      >
        {gene?.node?.symbol}
      </ExternalLink>
    </span>
    {gene?.node?.omim_gene_id && (
      <span>
        <span className={styles.separator}>|</span>
        <span className={styles.bold}>{dictionary.omim}:</span>
        <ExternalLink
          className={styles.link}
          href={`https://omim.org/entry/${gene.node.omim_gene_id}`}
        >
          {gene.node.omim_gene_id}
        </ExternalLink>
      </span>
    )}
    <span className={styles.bold}>
      <span className={styles.separator}>|</span>
      {removeUnderscoreAndCapitalize(gene?.node?.biotype)}
    </span>
    {gene?.node?.spliceai?.ds != null && (
      <span>
        <span className={styles.separator}>|</span>
        <span className={styles.bold}>{dictionary.spliceai}:</span>
        <span>{gene.node.spliceai.ds}</span>
      </span>
    )}
    {gene?.node?.gnomad?.pli != null && (
      <span>
        <span className={styles.separator}>|</span>
        <span className={styles.bold}>{dictionary.gnomad_pli}:</span>
        <span>{gene.node.gnomad.pli}</span>
      </span>
    )}
    {gene?.node?.gnomad?.loeuf != null && (
      <span>
        <span className={styles.separator}>|</span>
        <span className={styles.bold}>{dictionary.gnomad_loeuf}:</span>
        <span>{gene.node.gnomad.loeuf}</span>
      </span>
    )}
  </div>
);

export default EntityGeneConsequenceSubtitle;
