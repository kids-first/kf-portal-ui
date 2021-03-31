import { gql } from '@apollo/client';

export const VARIANT_QUERY = gql`
  query VariantQuery($sqon: JSON) {
    variants {
      hits(filters: $sqon) {
        edges {
          node {
            acls
            chromosome
            clinvar {
              clin_sig
              clinvar_id
              conditions
              inheritance
              interpretations
            }
            consequences {
              hits {
                edges {
                  node {
                    aa_change
                    biotype
                    canonical
                    cdna_position
                    cds_position
                    coding_dna_change
                    consequences
                    ensembl_gene_id
                    ensembl_transcript_id
                    entrez_gene_id
                    feature_type
                    hgvsc
                    hgvsp
                    impact_score
                    name
                    omim_gene_id
                    protein_position
                    strand
                    symbol
                    vep_impact
                    amino_acids {
                      reference
                      variant
                    }
                    codons {
                      reference
                      variant
                    }
                    conservations {
                      phylo_p17way_primate_rankscore
                    }
                    exon {
                      rank
                      total
                    }
                    intron {
                      rank
                      total
                    }
                    predictions {
                      FATHMM_converted_rankscore
                      cadd_score
                      dann_score
                      fathmm_pred
                      lrt_converted_rankscore
                      lrt_pred
                      polyphen2_hvar_pred
                      polyphen2_hvar_score
                      revel_rankscore
                      sift_converted_rank_score
                      sift_pred
                    }
                  }
                }
              }
            }
            frequencies {
              gnomad_exomes_2_1 {
                ac
                af
                an
                homozygotes
              }
              gnomad_genomes_2_1 {
                ac
                af
                an
                homozygotes
              }
              gnomad_genomes_3_0 {
                ac
                af
                an
                homozygotes
              }
              internal {
                combined {
                  ac
                  af
                  an
                  heterozygotes
                  homozygotes
                }
                gru {
                  ac
                  af
                  an
                  heterozygotes
                  homozygotes
                }
                hmb {
                  ac
                  af
                  an
                  heterozygotes
                  homozygotes
                }
              }
            }
            genes {
              hits {
                edges {
                  node {
                    ensembl_gene_id
                    entrez_gene_id
                    hgnc
                    location
                    name
                    omim_gene_id
                    symbol
                    cosmic {
                      hits {
                        edges {
                          node {
                            tumour_types_germline
                          }
                        }
                      }
                    }
                    ddd {
                      hits {
                        edges {
                          node {
                            disease_name
                          }
                        }
                      }
                    }
                    hpo {
                      hits {
                        edges {
                          node {
                            hpo_term_id
                            hpo_term_label
                            hpo_term_name
                          }
                        }
                      }
                    }
                    omim {
                      hits {
                        edges {
                          node {
                            name
                            omim_id
                          }
                        }
                      }
                    }
                    orphanet {
                      hits {
                        edges {
                          node {
                            disorder_id
                            inheritance
                            panel
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            studies {
              hits {
                edges {
                  node {
                    participant_number
                    study_id
                    frequencies {
                      gru {
                        ac
                        af
                        an
                        heterozygotes
                        homozygotes
                      }
                      hmb {
                        ac
                        af
                        an
                        heterozygotes
                        homozygotes
                      }
                    }
                  }
                }
              }
            }
            hash
          }
        }
      }
    }
  }
`;
