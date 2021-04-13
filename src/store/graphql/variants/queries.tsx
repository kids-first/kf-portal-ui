import { gql } from '@apollo/client';

export const SEARCH_VARIANT_TABLE_QUERY = gql`
  query GetSearchedVariant(
    $sqon: JSON
    $pageSize: Int
    $offset: Int
    $sort: [Sort]
    $studiesSize: Int
  ) {
    variants {
      hits(filters: $sqon, first: $pageSize, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            hgvsg
            hash
            locus
            variant_class
            clinvar {
              clinvar_id
              clin_sig
            }
            rsnumber
            participant_number
            participant_ids
            consequences {
              hits {
                edges {
                  node {
                    symbol
                    canonical
                    vep_impact
                    symbol
                    consequences
                    aa_change
                    impact_score
                  }
                }
              }
            }
            frequencies {
              internal {
                lower_bound_kf {
                  homozygotes
                  af
                  an
                  ac
                  heterozygotes
                }
                upper_bound_kf {
                  homozygotes
                  af
                  an
                  ac
                  heterozygotes
                }
              }
            }
            studies {
              hits {
                edges {
                  node {
                    study_id
                    participant_number
                  }
                }
                total
              }
            }
            genes {
              hits {
                edges {
                  node {
                    symbol
                  }
                }
              }
            }
          }
        }
      }
    }
    studies {
      hits(first: $studiesSize) {
        edges {
          node {
            id
            code
            domain
          }
        }
      }
    }
  }
`;

export const TAB_FREQUENCIES_QUERY = gql`
  query GetFrequenciesTabVariant($sqon: JSON, $studiesSize: Int) {
    variants {
      hits(filters: $sqon) {
        edges {
          node {
            locus
            participant_number
            participant_ids
            frequencies {
              topmed {
                ac
                af
                an
                homozygotes
                heterozygotes
              }
              one_thousand_genomes {
                ac
                af
                an
              }
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
                lower_bound_kf {
                  ac
                  af
                  an
                  heterozygotes
                  homozygotes
                }
                upper_bound_kf {
                  ac
                  af
                  an
                  heterozygotes
                  homozygotes
                }
              }
            }
            studies {
              hits {
                edges {
                  node {
                    frequencies {
                      lower_bound_kf {
                        ac
                        af
                        an
                        heterozygotes
                        homozygotes
                      }
                      upper_bound_kf {
                        ac
                        af
                        an
                        heterozygotes
                        homozygotes
                      }
                    }
                    participant_number
                    study_id
                  }
                }
              }
            }
          }
        }
      }
    }
    studies {
      hits(first: $studiesSize) {
        edges {
          node {
            code
            id
            domain
          }
        }
      }
    }
  }
`;

export const TAB_SUMMARY_QUERY = gql`
  query GetSummaryTabVariant($sqon: JSON) {
    variants {
      hits(filters: $sqon) {
        total
        edges {
          node {
            alternate
            chromosome
            hgvsg
            hash
            locus
            clinvar {
              clinvar_id
              clin_sig
            }
            rsnumber
            reference
            start
            participant_number
            participant_ids
            variant_class
            consequences {
              hits {
                edges {
                  node {
                    biotype
                    symbol
                    vep_impact
                    symbol
                    consequences
                    ensembl_gene_id
                    coding_dna_change
                    omim_gene_id
                    aa_change
                    strand
                    canonical
                    conservations {
                      phylo_p17way_primate_rankscore
                    }
                    ensembl_transcript_id
                    predictions {
                      fathmm_pred
                      fathmm_converted_rankscore
                      cadd_rankscore
                      dann_score
                      lrt_pred
                      lrt_converted_rankscore
                      revel_rankscore
                      sift_converted_rankscore
                      sift_pred
                      polyphen2_hvar_score
                      polyphen2_hvar_pred
                    }
                    impact_score
                  }
                }
              }
            }
            frequencies {
              internal {
                lower_bound_kf {
                  ac
                  af
                  an
                  homozygotes
                  heterozygotes
                }
                upper_bound_kf {
                  ac
                  af
                  an
                  homozygotes
                  heterozygotes
                }
              }
            }
            studies {
              hits {
                total
              }
            }
            genes {
              hits {
                edges {
                  node {
                    symbol
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const TAB_CLINICAL_QUERY = gql`
  query GetClinicalTabVariant($sqon: JSON) {
    variants {
      hits(filters: $sqon) {
        edges {
          node {
            clinvar {
              clin_sig
              clinvar_id
              conditions
              inheritance
            }
            genes {
              hits {
                edges {
                  node {
                    symbol
                    omim_gene_id
                    omim {
                      hits {
                        edges {
                          node {
                            omim_id
                            name
                            inheritance
                          }
                        }
                      }
                    }
                    orphanet {
                      hits {
                        edges {
                          node {
                            panel
                            inheritance
                            disorder_id
                          }
                        }
                      }
                    }
                    cosmic {
                      hits {
                        edges {
                          node {
                            tumour_types_germline
                          }
                        }
                      }
                    }
                    hpo {
                      hits {
                        edges {
                          node {
                            hpo_term_label
                            hpo_term_id
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
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const VARIANT_STATS_QUERY = gql`
  query VariantStats {
    variantStats {
      hits {
        edges {
          node {
            distinctVariantsCount
            occurrencesCount
            participantsCount
            studiesCount
          }
        }
      }
    }
  }
`;
