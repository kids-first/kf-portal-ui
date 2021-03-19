import { gql } from '@apollo/client';

export const VARIANT_TABLE_QUERY = gql`
  query($sqon: JSON) {
    variant {
      hits(filters: $sqon) {
        edges {
          node {
            id
            hash
            locus
            clinvar {
              clin_sig
            }
            rsnumber
            participant_number
            consequences {
              hits {
                edges {
                  node {
                    vep_impact
                    consequences
                    symbol
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
              symbol
            }
          }
        }
      }
    }
  }
`;
