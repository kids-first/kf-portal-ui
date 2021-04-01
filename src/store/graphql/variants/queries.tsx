import { gql } from '@apollo/client';

export const VARIANT_TABLE_QUERY = gql`
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
