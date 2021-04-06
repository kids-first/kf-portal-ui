import { gql } from '@apollo/client';

export const SEARCH_VARIANT_TABLE_QUERY = gql`
  query GetSearchedVariant($sqon: JSON, $pageSize: Int, $offset: Int) {
    variants {
      hits(filters: $sqon, first: $pageSize, offset: $offset) {
        total
        edges {
          node {
            hgvsg
            hash
            locus
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
                combined {
                  homozygotes
                  af
                  an
                  ac
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

export const TAB_FREQUENCIES_QUERY = gql`
  query GetFrequenciesTabVariant($sqon: JSON) {
    variants {
      hits(filters: $sqon) {
        edges {
          node {
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
                combined {
                  homozygotes
                  af
                  an
                  ac
                }
              }
            }
            studies {
              hits {
                edges {
                  node {
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
  }
`;

export const TAB_SUMMARY_QUERY = gql`
  query GetSummaryTabVariant($sqon: JSON) {
    variants {
      hits(filters: $sqon) {
        edges {
          node {
            hash
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
