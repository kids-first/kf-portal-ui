import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';

export interface IVariantResultTree {
  variants: IArrangerResultsTree<IVariantEntity>;
}
export interface IVariantSomaticResultTree {
  variants_somatic: IArrangerResultsTree<IVariantSomaticEntity>;
}

export interface IVariantEntityResultTree {
  variants: IArrangerResultsTree<IVariantEntity>;
}

export interface IVariantSomaticEntityResultTree {
  variants_somatic: IArrangerResultsTree<IVariantSomaticEntity>;
}

export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

export interface IConservationsEntity {
  phyloP100way_vertebrate: number;
  phyloP17way_primate: number;
}

export interface IBoundType {
  ac?: number;
  af?: number;
  an?: number;
  pn?: number;
  pc?: number;
  pf?: number;
  het?: number;
  hom?: number;
}

export interface IVariantInternalFrequencies {
  total: IBoundType;
}

export interface IExternalFrequenciesEntity {
  gnomad_exomes_2_1_1: IBoundType;
  gnomad_genomes_2_1_1: IBoundType;
  gnomad_genomes_3: IBoundType;
  thousand_genomes: IBoundType;
  topmed_bravo: IBoundType;
}

export interface IConsequenceNode {
  node: IConsequenceEntity;
}
export interface IPredictionEntity {
  cadd_phred: number;
  cadd_score: number;
  dann_score: number;
  fathmm_pred: string;
  fathmm_score: number;
  lrt_pred: string;
  lrt_score: number;
  polyphen2_hvar_pred: string;
  polyphen2_hvar_score: number;
  revel_score: number;
  sift_pred: string;
  sift_score: number;
}

export interface IConsequenceEntity {
  id: string;
  score: number;
  aa_change: string | undefined | null;
  canonical: boolean;
  cdna_position: string;
  cds_position: string;
  consequence: string[];
  ensembl_feature_id: string;
  ensembl_transcript_id: string;
  feature_type: string;
  hgvsc: string;
  hgvsp: string;
  impact_score: number;
  mane_plus: boolean;
  mane_select: boolean;
  picked: boolean;
  protein_position: string;
  refseq_mrna_id: string[];
  strand: string;
  uniprot_id: string;
  vep_impact: Impact;
  amino_acids: {
    reference: string;
    variant: string;
  };
  codons: {
    reference: string;
    variant: string;
  };
  conservations: IConservationsEntity;
  exon: {
    rank: number;
    total: number;
  };
  intron: {
    rank: number;
    total: number;
  };
  predictions: IPredictionEntity;
  coding_dna_change: string;
}

export interface IClinVar {
  clinvar_id: string | undefined;
  inheritance: string[];
  conditions: string[];
  clin_sig: string[];
  interpretations: string[];
}

export interface IGeneCosmic {
  id: any;
  score: number;
  tumour_types_germline: string[];
}

export interface IGeneDdd {
  id: any;
  score: number;
  disease_name: string;
}

export interface IGeneHpo {
  id: any;
  score: number;
  hpo_term_id: string;
  hpo_term_label: string;
  hpo_term_name: string;
}

export interface IGeneOmim {
  id: any;
  score: number;
  inheritance: string[];
  inheritance_code: string[];
  name: string;
  omim_id: string;
}

export interface IGeneOrphanet {
  id: any;
  score: number;
  inheritance: string;
  disorder_id: number;
  panel: string;
}

export interface IGeneEntity {
  id: any;
  score: number;
  alias: string[];
  biotype: string;
  ensembl_gene_id: string;
  entrez_gene_id: string;
  hgnc: string;
  location: string;
  name: string;
  omim_gene_id: string;
  symbol: string;
  consequences: IArrangerResultsTree<IConsequenceEntity>;
  cosmic: IArrangerResultsTree<IGeneCosmic>;
  ddd: IArrangerResultsTree<IGeneDdd>;
  gnomad: {
    loeuf: string;
    pli: number;
  };
  hpo: IArrangerResultsTree<IGeneHpo>;
  omim: IArrangerResultsTree<IGeneOmim>;
  orphanet: IArrangerResultsTree<IGeneOrphanet>;
  spliceai: {
    ds: number;
    type: string[];
  };
}

export interface IVariantEntity {
  id: string;
  score: number;
  alternate: string;
  assembly_version: string;
  chromosome: string;
  dna_change: string;
  end: number;
  gene_external_reference: string[];
  hash: string;
  hgvsg: string;
  locus: string;
  max_impact_score: number;
  reference: string;
  rsnumber: string;
  start: number;
  variant_class: string;
  variant_external_reference: string;
  clinvar: IClinVar;
  external_frequencies: IExternalFrequenciesEntity;
  genes: IArrangerResultsTree<IGeneEntity>;
  internal_frequencies: IVariantInternalFrequencies;
  studies: IArrangerResultsTree<IVariantStudyEntity>;
}

export interface IVariantSomaticEntity {
  id: string;
  score: number;
  alternate: string;
  assembly_version: string;
  chromosome: string;
  clinvar: IClinVar;
  cmc: {
    mutation_url: string;
    shared_aa: number;
    cosmic_id: string;
    sample_mutated: number;
    sample_tested: number;
    tier: string;
    sample_ratio: number;
  };
  dna_change: string;
  end: number;
  external_frequencies: IExternalFrequenciesEntity;
  gene_external_reference: string[];
  genes: IArrangerResultsTree<IGeneEntity>;
  hash: string;
  hgvsg: string;
  hotspot: boolean;
  internal_frequencies: IVariantInternalFrequencies;
  locus: string;
  max_impact_score: number;
  reference: string;
  rsnumber: string;
  start: number;
  studies: IArrangerResultsTree<IVariantStudyEntity>;
  variant_class: string;
  variant_external_reference: string;
}

export interface IVariantStudyEntity {
  id: string;
  score: number | null;
  participant_ids: string[];
  study_code: string;
  study_id: string;
  transmissions: string[];
  zygosity: string[];
  total: IBoundType;
}

export type ITableVariantEntity = IVariantEntity & {
  key: string;
};

export type ITableVariantSomaticEntity = IVariantSomaticEntity & {
  key: string;
};
