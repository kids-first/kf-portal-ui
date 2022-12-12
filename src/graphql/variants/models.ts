import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { IVariantEntity as IVariantEntityFerlab } from '@ferlab/ui/core/pages/VariantEntity/types';

export interface IVariantResultTree {
  variants: IArrangerResultsTree<IVariantEntity>;
}

export interface IVariantEntityResultTree {
  variants: IArrangerResultsTree<IVariantEntityFerlab>;
}

export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

export interface IConservationsEntity {
  phylo_p17way_primate_rankscore: number;
}

export interface IPredictionEntity {
  fathmm_pred: number;
  lrt_pred: string;
  lrt_converted_rankscore: number;
  revel_rankscore: number;
  sift_pred: string;
  polyphen2_hvar_pred: string;
  polyphen2_hvar_rankscore: number;
  sift_converted_rankscore: number;
  cadd_rankscore: number;
  dann_rankscore: number;
  fathmm_converted_rankscore: number;
}

export interface IBoundType {
  ac?: number;
  af?: number;
  an?: number;
  hom?: number;
  pn?: number;
  pc?: number;
  pf?: number;
  heterozygotes?: number;
  homozygotes?: number;
}

interface IVariantFrequenciesInternal {
  lower_bound_kf: IBoundType;
  upper_bound_kf: IBoundType;
}

export interface IExternalFrequenciesEntity {
  gnomad_exomes_2_1: IBoundType;
  gnomad_genomes_2_1: IBoundType;
  gnomad_genomes_3_0: IBoundType;
  gnomad_genomes_3_1_1: IBoundType;
  one_thousand_genomes: IBoundType;
  topmed: IBoundType;
  internal: IVariantFrequenciesInternal;
}

export interface IConsequenceNode {
  node: IConsequenceEntity;
}

export interface IConsequenceEntity {
  id: string;
  hgvsc: string;
  symbol: string;
  consequences: string[];
  vep_impact: Impact;
  aa_change: string | undefined | null;
  impact_score: number | null;
  canonical: boolean;
  coding_dna_change: string;
  strand: string;
  refseq_mrna_id: string;
  ensembl_transcript_id: string;
  ensembl_gene_id: string;
  predictions: IPredictionEntity;
  conservations: IConservationsEntity;
}

export interface IClinVar {
  clinvar_id: string | undefined;
  inheritance: string[];
  conditions: string[];
  clin_sig: string[];
  interpretations: string[];
}

interface IGeneCosmic {
  id: any;
  score: number;
  tumour_types_germline: string[];
}

interface IGeneDdd {
  id: any;
  score: number;
  disease_name: string;
}

interface IGeneHpo {
  id: any;
  score: number;
  hpo_term_id: string;
  hpo_term_label: string;
  hpo_term_name: string;
}

interface IGeneOmim {
  id: any;
  score: number;
  inheritance: string[];
  inheritance_code: string;
  name: string;
  omim_id: string;
}

interface IGeneOrphanet {
  id: any;
  score: number;
  inheritance: string;
  disorder_id: number;
  panel: string;
}

export interface IGeneEntity {
  id: any;
  score: number;
  alias: string;
  ensembl_gene_id: string;
  entrez_gene_id: number;
  hgnc: string;
  location: string;
  name: string;
  omim_gene_id: string;
  symbol: string;
  cosmic: IArrangerResultsTree<IGeneCosmic>;
  ddd: IArrangerResultsTree<IGeneDdd>;
  hpo: IArrangerResultsTree<IGeneHpo>;
  omim: IArrangerResultsTree<IGeneOmim>;
  orphanet: IArrangerResultsTree<IGeneOrphanet>;
}

export interface IVariantEntity {
  id: string;
  study_id: string;
  score: number;
  acls: string;
  alternate: string;
  chromosome: string;
  external_study_ids: string;
  gene_external_reference: string;
  genome_build: string;
  hash: string;
  hgvsg: string;
  locus: string;
  max_impact_score: number;
  participant_frequency: number;
  participant_number: number;
  participant_number_visible: number;
  participant_total_number: number;
  reference: string;
  release_id: string;
  rsnumber: string;
  start: number;
  transmissions: string;
  variant_class: string;
  variant_external_reference: string;
  vep_impacts: string;
  zygosity: string;
  studies: IArrangerResultsTree<IVariantStudyEntity>;
  consequences: IArrangerResultsTree<IConsequenceEntity>;
  clinvar: IClinVar;
  frequencies: IExternalFrequenciesEntity;
  genes: IArrangerResultsTree<IGeneEntity>;
}

export interface IVariantStudyEntity {
  id: string;
  acls: string[];
  external_study_ids: string[];
  frequencies: IVariantFrequenciesInternal;
  participant_ids: string[];
  participant_number: number;
  score: number | null;
  study_code: string;
  study_id: string;
  transmissions: string[];
}

export type ITableVariantEntity = IVariantEntity & {
  key: string;
};
