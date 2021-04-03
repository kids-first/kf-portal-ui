import { gql } from '@apollo/client';

export const SEARCH_VARIANT_TABLE_QUERY = gql`
  query($sqon: JSON, $pageSize: Int, $offset: Int) {
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

export const TABLE_STUDIES_QUERY = gql`
  query($sqon: JSON) {
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
