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
          }
        }
      }
    }
  }
`;

export const GENE_TABLE_QUERY = gql`
  {
    variant {
      hits {
        edges {
          node {
            id
            hash
            locus
          }
        }
      }
    }
  }
`;
