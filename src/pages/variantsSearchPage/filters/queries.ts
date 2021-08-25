import { gql } from '@apollo/client';

export const VARIANT_QUERY = gql`
  query VariantInformation($sqon: JSON, $first: Int, $offset: Int) {
    variants {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            id
            variant_class
            consequences {
              hits {
                edges {
                  node {
                    consequences
                  }
                }
              }
            }
          }
        }
      }
      aggregations {
        variant_class {
          buckets {
            key
            doc_count
          }
        }
        consequences__consequences {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
`;
