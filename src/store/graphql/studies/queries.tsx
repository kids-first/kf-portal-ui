import { gql } from '@apollo/client';

import { fields } from './models';

export const STUDIES_QUERY = gql`
  query StudiesInformation ($sqon: JSON, $first: Int, $offset: Int){
    studies {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            kf_id
            name
            domain
            score
            code
            family_count
            file_count
            participant_count
            data_access_authority
            external_id
            data_category_count {
              hits {
                edges {
                  node {
                    data_category
                    count
                  }
                }
              }
            }
            program
          }
        }
        total
      }
       aggregations (filters: $sqon){
        ${fields.map(
          (f) =>
            f +
            ' {\n          buckets {\n            key\n            doc_count\n          }\n        }',
        )}
      }
    }
  }
`;

export const STUDIES_SEARCH_QUERY = gql`
  query StudiesInformation($sqon: JSON, $first: Int, $offset: Int) {
    studies {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            kf_id
            name
            domain
            score
            code
            family_count
            file_count
            participant_count
            data_access_authority
            external_id
            data_category_count {
              hits {
                edges {
                  node {
                    data_category
                    count
                  }
                }
              }
            }
            program
          }
        }
      }
    }
  }
`;

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
  query ExtendedMapping {
    ${index} {
      extended
    }
  }
`;
